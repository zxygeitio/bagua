import { castCoins } from './cast/coin'
import { mulberry32 } from './rng'
import type { Line } from './types'

export function calendarKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export function dailySeed(date: Date = new Date()): number {
  const key = calendarKey(date)
  let hash = 2166136261
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function castDaily(date: Date = new Date()): Line[] {
  return castCoins(mulberry32(dailySeed(date)))
}
