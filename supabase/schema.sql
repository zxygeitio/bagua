-- bagua 数据库 Schema
-- 在 Supabase SQL Editor 中执行此脚本

-- 启用 UUID
create extension if not exists "uuid-ossp";

-- 匿名用户表（每个设备/浏览器一个匿名 ID）
create table if not exists public.bagua_users (
  id uuid primary key default uuid_generate_v4(),
  anonymous_id text unique not null,
  display_name text,
  created_at timestamptz default now(),
  last_seen_at timestamptz default now()
);

-- 索引
create index if not exists idx_bagua_users_anon on public.bagua_users(anonymous_id);

-- 占卜历史表
create table if not exists public.bagua_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.bagua_users(id) on delete cascade,
  client_id text not null, -- localStorage 的 nanoid
  -- 当前版本只写入 coins；其余值仅为兼容已存在的历史记录与分享链接
  method text not null check (method in ('coins', 'yarrow', 'manual', 'meihua', 'time')),
  question text,
  ben_gua_id integer not null,
  bian_gua_id integer,
  hu_gua_id integer,
  changing_lines integer[] default '{}',
  lines_data jsonb not null, -- 完整 6 爻数据
  result_data jsonb, -- 卦变关系等
  notes text,
  favorite boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, client_id) -- 防重复同步
);

-- 索引
create index if not exists idx_bagua_history_user on public.bagua_history(user_id, created_at desc);
create index if not exists idx_bagua_history_favorite on public.bagua_history(user_id, favorite);

-- RLS 策略（v2：身份头关联，2026-09-09 收紧）
-- 客户端通过 supabase-js global.headers 发送 `x-anonymous-id`，
-- PostgREST 将其暴露为 GUC `request.header.x-anonymous-id`，策略据此定位用户。
-- 旧版策略 using(true) 等于对持 anon key 的任何人全开读写，已废弃。

-- 身份辅助函数：当前请求对应的 bagua_users.id（无法识别时返回 NULL，策略判定为拒绝）
create or replace function public.current_bagua_user_id()
returns uuid
language sql
stable
as $$
  select id from public.bagua_users
  where anonymous_id = nullif(current_setting('request.header.x-anonymous-id', true), '')
  limit 1
$$;

-- bagua_users：RLS 开启；只允许以自己的匿名身份注册/读取
alter table public.bagua_users enable row level security;

drop policy if exists "users_select_any" on public.bagua_users;
create policy "users_select_own" on public.bagua_users
  for select using (
    anonymous_id = nullif(current_setting('request.header.x-anonymous-id', true), '')
  );

create policy "users_insert_self" on public.bagua_users
  for insert with check (
    anonymous_id = nullif(current_setting('request.header.x-anonymous-id', true), '')
  );

alter table public.bagua_history enable row level security;

drop policy if exists "history_select_own" on public.bagua_history;
drop policy if exists "history_insert_own" on public.bagua_history;
drop policy if exists "history_update_own" on public.bagua_history;
drop policy if exists "history_delete_own" on public.bagua_history;

create policy "history_select_own" on public.bagua_history
  for select using (user_id = public.current_bagua_user_id());

create policy "history_insert_own" on public.bagua_history
  for insert with check (user_id = public.current_bagua_user_id());

create policy "history_update_own" on public.bagua_history
  for update using (user_id = public.current_bagua_user_id());

create policy "history_delete_own" on public.bagua_history
  for delete using (user_id = public.current_bagua_user_id());

-- 收藏标签
create table if not exists public.bagua_tags (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.bagua_users(id) on delete cascade,
  name text not null,
  color text default '#6366F1',
  created_at timestamptz default now(),
  unique (user_id, name)
);

create table if not exists public.bagua_history_tags (
  history_id uuid not null references public.bagua_history(id) on delete cascade,
  tag_id uuid not null references public.bagua_tags(id) on delete cascade,
  primary key (history_id, tag_id)
);

-- 分享链接表（生成可分享的公开链接）
create table if not exists public.bagua_shares (
  id uuid primary key default uuid_generate_v4(),
  short_code text unique not null,
  history_id uuid not null references public.bagua_history(id) on delete cascade,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_bagua_shares_code on public.bagua_shares(short_code);

alter table public.bagua_shares enable row level security;
-- 分享链接设计为公开可读（short_code 不可枚举）
create policy "shares_select_public" on public.bagua_shares
  for select using (true);
-- 只有记录本人能生成分享链接
create policy "shares_insert_own" on public.bagua_shares
  for insert with check (
    exists (
      select 1 from public.bagua_history h
      where h.id = history_id and h.user_id = public.current_bagua_user_id()
    )
  );

-- 用户首次访问时自动创建匿名账户
-- 在应用层调用 supabase.from('bagua_users').upsert({ anonymous_id })
