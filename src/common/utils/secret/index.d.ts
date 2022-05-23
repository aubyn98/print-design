
/**
 * AES加密
 * @param word 文本
 * @param key 密钥
 * 
 * */ 
 export function Encrypt<T>(word: string,key:string): T
 /**
 * AES解密
 * @param word 文本
 * @param key 密钥
 * 
 * */ 
  export function Decrypt<T>(word: string,key:string): T
 /**
 * base64解密
 * @param content 解码文本
 * 
 * */ 
  export function Base64Decoder<T>(content: string): T
  