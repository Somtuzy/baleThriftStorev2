import bcrypt from "bcrypt";

export const hashPassword = async (passwordInput: string): Promise<string> => {
  const salt = await bcrypt.genSalt(parseFloat(process.env.ROUNDS as string));
  return await bcrypt.hash(passwordInput, salt);
};
export const verifyPassword = async (passwordInput: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(passwordInput, hashedPassword);
};
