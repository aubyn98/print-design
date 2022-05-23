
import CryptoJS from 'crypto-js' //引用AES源码js

//解密方法
export function Decrypt(word,key) {
  if (!word) return
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  let decrypt = CryptoJS.AES.decrypt(srcs, CryptoJS.enc.Utf8.parse(key) , {  mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}

//加密方法
export function Encrypt(word,key) {
  if (!word) return
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.AES.encrypt(srcs, CryptoJS.enc.Utf8.parse(key), {  mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.ciphertext.toString().toUpperCase()
}


// Base64解码
export function Base64Decoder(content){
return CryptoJS.enc.Base64.parse(content).toString(CryptoJS.enc.Utf8)
}