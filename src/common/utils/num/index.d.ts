/**
 * 数字转大写中文
 */
export function digit2Uppercase(val: number): string

/**
 * 数字相乘
 * @param {number | string} multiplicand  被乘数;
 * @param {number | string} multiplier    乘数;
 */
export function multiply(multiplicand: number | string, multiplier: number | string): number

/**
 * 数字相除
 * @param {number | string} dividend  被除数;
 * @param {number | string} divisor   除数,不能为0
 */
export function divide(dividend: number | string, divisor: number | string): number

/**
 * 数字相加
 * @param {number | string} summand  被加数;
 * @param {number | string} addend   加数;
 */
export function add(summand: number | string, addend: number | string): number

/**
 * 数字相减
 * @param {number | string} minuend      被减数;
 * @param {number | string} subtrahend   减数;
 */
export function subtract(minuend: number | string, subtrahend: number | string): number

/**
 * 科学计数法转小数 例：7e-7 -> 0.0000007
 * @param {string} numStr  科学计数法的字符串;
 */
export function scientificToNumber(numStr: string): string

/**
 * 排除NaN
 * @param {number | string} v  要判断的值
 * @param {number | string} d  如果是NaN，则返回的默认值， 默认为 0
 */
export function excludeNaN<T>(v: T, d?: T): T
