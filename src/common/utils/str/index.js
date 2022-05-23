export function getRandom(random = 0, sign = '-') {
  return [Date.now().toString(), Math.random().toString(16).slice(2, 10), Math.random().toString(16).slice(7), random.toString()].join(sign)
}

export function getRandomStr(len = 8, $chars) {
  len = len || 32
  $chars ||= 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

export function getPascalCase(str) {
  return str
    .replace(/([^-])([^-]*)/g, function (m2, $1, $2) {
      return $1.toLocaleUpperCase() + $2.toLocaleLowerCase()
    })
    .replace(/-/g, '')
}

export function testIdCard(str) {
  let _IDRe18 = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  let _IDre15 = /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/
  return _IDRe18.test(str) || _IDre15.test(str)
}


