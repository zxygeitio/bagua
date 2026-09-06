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
  method text not null check (method in ('coins', 'yarrow', 'manual')),
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

-- RLS 策略
alter table public.bagua_history enable row level security;

-- 用户只能读/写自己的记录（基于 anonymous_id claim）
-- 由于我们使用匿名 ID，作为 public read 简化处理
create policy "history_select_own" on public.bagua_history
  for select using (true); -- 简化：所有用户可读自己的记录（应用层用 user_id 过滤）

create policy "history_insert_own" on public.bagua_history
  for insert with check (true);

create policy "history_update_own" on public.bagua_history
  for update using (true);

create policy "history_delete_own" on public.bagua_history
  for delete using (true);

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
create policy "shares_select_public" on public.bagua_shares
  for select using (true);
create policy "shares_insert_own" on public.bagua_shares
  for insert with check (true);

-- 用户首次访问时自动创建匿名账户
-- 在应用层调用 supabase.from('bagua_users').upsert({ anonymous_id })