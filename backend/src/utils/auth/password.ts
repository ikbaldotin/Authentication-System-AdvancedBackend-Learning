import bcrypt from "bcrypt";
import { env } from "../../config/env.config.js";
const slatRounds = Number(env.SALT_ROUNDS);

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, slatRounds);
};

export const comparePassword = async (
  password: string,
  hashPassword: string,
) => {
  return await bcrypt.compare(password, hashPassword);
};
