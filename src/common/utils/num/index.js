import Decimal from 'decimal.js'
export function digit2Uppercase(n) {
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [
    ['元', '万', '亿', '万亿'],
    ['', '拾', '佰', '仟'],
  ]
  const head = n < 0 ? '欠' : ''
  n = Math.abs(n)
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  )
}

export function scientificToNumber(num) {
  const reg = /^(\d+)(\.\d+)?(e)([\-]?\d+)$/
  const regRes = reg.exec(num)
  return '0.' + ''.padEnd(Math.abs(regRes[4]) - 1, '0') + regRes[1]
}

export function divide(dividend, divisor) {
  return Decimal.div(dividend, divisor).toNumber()
}

export function multiply(multiplicand, multiplier) {
  return Decimal.mul(multiplicand, multiplier).toNumber()
}

export function add(summand, addend) {
  return Decimal.add(summand, addend).toNumber()
}

export function subtract(minuend, subtrahend) {
  return Decimal.sub(minuend, subtrahend).toNumber()
}

export function excludeNaN(v, d = 0) {
  return isNaN(v) ? d : v
}
