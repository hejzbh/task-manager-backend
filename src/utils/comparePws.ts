import bcrypt from "bcrypt";

export async function comparePws(plainTextPw: string, hashPw: string) {
  return await bcrypt.compare(plainTextPw, hashPw);
}
