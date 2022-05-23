/**
 * 获取日期
 * @param { number } time 当前时间戳  可选，默认 Date.now()
 * @param { string } fmt  日期格式    可选，默认 yyyy-MM-dd
 * @param { string } join 连接符    可选，默认 -
 */
export function getDate(
  time?: number,
  fmt?: 'yyyy-MM'|'yyyy-MM-dd' | 'yyyy-MM-dd hh:mm' | 'yyyy-MM-dd hh:mm:ss' | 'yyyyMMdd' | 'yyyyMMddhhmm' | 'yyyyMMddhhmmss',
  join?: string
): string
