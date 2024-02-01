import { sign, verify } from "jsonwebtoken";

export function signJwt(payload) {
  const token = sign(payload, process.env.SECRET_KEY, { expiresIn: "10h" });
  return token;
}

export function verifyJwt(accessToken) {
  try {
    const decoded = verify(accessToken, "process.env.SECRET_KEY");
    return decoded;
  } catch (error) {
    return null;
  }
}
