/**
 * 可重放的伪随机数生成器 (mulberry32)
 * 用于起卦算法的可重放性（相同种子产生相同卦）
 */
export function mulberry32(seed: number): () => number {
  let a = seed | 0
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** 基于字符串生成确定性 seed */
export function seedFromString(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** 基于 Date.now 生成非确定性 seed */
export function randomSeed(): number {
  return (Math.random() * 0xffffffff) >>> 0
}

/** 整数随机数 [min, max] */
export function randomInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}
