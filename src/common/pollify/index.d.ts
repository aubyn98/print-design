declare global {
  interface Function {
    /**
     * 软绑定
     * @param thisArg An object to which the this keyword can refer inside the new function.
     * @param argArray A list of arguments to be passed to the new function.
     */
    softBind(thisArg: any, ...argArray: any[]): any
  }
}
export {}
