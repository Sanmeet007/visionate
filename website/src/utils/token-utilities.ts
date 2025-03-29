import jsonwebtoken, { SignOptions } from "jsonwebtoken";
import ms from "ms";

const createToken = (
  payload: string | Buffer | object,
  expiresIn: ms.StringValue = "2h"
): string => {
  const secretKey = process.env.SECURITY_STRING;
  if (!secretKey) throw new Error("SECURITY_STRING is not defined in env.");

  const options: SignOptions = {
    expiresIn,
    algorithm: "HS256",
  };

  return jsonwebtoken.sign(payload, secretKey, options);
};

export default createToken;

const verifyToken = (token: string) => {
  return jsonwebtoken.verify(token, process.env.SECURITY_STRING!);
};

const decodeToken = (token: string) => {
  return jsonwebtoken.decode(token);
};

export { createToken, verifyToken, decodeToken };
