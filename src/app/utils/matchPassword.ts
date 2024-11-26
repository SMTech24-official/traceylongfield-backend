import * as argon2 from "argon2";

export const matchPassword=async(plainText:string,hasText:string)=>{
  const res=  await argon2.verify(hasText,plainText)

  return res
}