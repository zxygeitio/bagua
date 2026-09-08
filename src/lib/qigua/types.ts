export type YinYang = 'yang' | 'yin'
export type YaoPosition = 1 | 2 | 3 | 4 | 5 | 6

export type TrigramName = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤'
export type WuXing = '金' | '木' | '水' | '火' | '土'

export interface Line {
  position: YaoPosition
  yinYang: YinYang
  isChanging: boolean
  value: 6 | 7 | 8 | 9
}
