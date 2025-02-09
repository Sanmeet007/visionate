import { Argon2id } from "oslo/password";

const argon2id = new Argon2id();

/**
 * Function to generate a password hash using the string passed as password
 */
export const generatePasswordHash = async (password: string) => {
  return await argon2id.hash(password);
};

/**
 * Function to verify if the provided password matches the hashed password
 */
export const verifyPassword = async (
  hashedPassword: string,
  enteredPassword: string
) => {
  return await argon2id.verify(hashedPassword, enteredPassword);
};
