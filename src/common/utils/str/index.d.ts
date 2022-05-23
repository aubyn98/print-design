/**
 * 获取随机字符串
 * @param { string | number } random 随机数 可选参数
 * @param { string } sign 分隔符 可选参数
 */
export function getRandom(random?: string | number, sign?: string): string

/**
 * 获取随机字符串 / uuid len=8
 * @param { number } len 字符串长度
 * @param { string } $chars 参考字符串
 */
export function getRandomStr(len: number = 8, $chars?: string): string

/**
 * 将连字符名称转换为大写驼峰
 * @param { string } str 字符串
 */
export function getPascalCase(str: string): string

/**
 * 校验身份证号码
 * @param { string } str 身份证字符串
 */
export function testIdCard(str: string): string
