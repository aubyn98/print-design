export function getDate(time = Date.now(), fmt = 'yyyy-MM-dd', join = '-') {
  typeof time === 'string' && (time = new Date(time).getTime())
  let date = new Date(time + 28800000).toISOString().replace('T', ' ')
  const joinReg = new RegExp(join, 'g')
  if (join !== '-' && typeof join === 'string') date = date.replace(/-/g, join)
  if (fmt === 'yyyy-MM') return date.slice(0, 7)
  if (fmt === 'yyyy-MM-dd hh:mm') return date.slice(0, 16)
  if (fmt === 'yyyy-MM-dd hh:mm:ss') return date.slice(0, 19)
  if (fmt === 'yyyyMM') return date.slice(0, 7).replace(joinReg, '')
  if (fmt === 'yyyyMMdd') return date.slice(0, 10).replace(joinReg, '')
  if (fmt === 'yyyyMMdd hhmm') return date.slice(0, 16).replace(joinReg, '').replace(/:/g, '')
  if (fmt === 'yyyyMMdd hhmmss') return date.slice(0, 19).replace(joinReg, '').replace(/:/g, '')
  if (fmt === 'yyyyMMddhhmm') return date.slice(0, 16).replace(joinReg, '').replace(/ /g, '').replace(/:/g, '')
  if (fmt === 'yyyyMMddhhmmss') return date.slice(0, 19).replace(joinReg, '').replace(/ /g, '').replace(/:/g, '')
  return date.slice(0, 10)
}

