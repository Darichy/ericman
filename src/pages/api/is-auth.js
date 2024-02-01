// import type { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/utils/constants";
import { prisma } from "../../../prisma/constant";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import cookie from "cookie";
import { serialize } from "cookie";
import { createRouter, expressWrapper } from "next-connect";
const router = createRouter();

function generateAccessToken(userId) {
  const accessToken = jwt.sign({ userId }, "process.env.JWT_SECRET", {
    expiresIn: "3h", // Set the expiration time for the access token
  });
  return accessToken;
}

function isValidToken(accessToken) {
  try {
    // Verify the refresh token using your secret key
    const decodedToken = jwt.verify(accessToken, "process.env.JWT_SECRET");
    console.log({ decodedToken });
    // Check if the token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp > currentTime) {
      // You can perform additional checks here if needed (e.g., check against a database)
      // Return true if the token is valid and not expired
      return true;
    }

    // If the token is expired, return false
    return false;
  } catch (error) {
    // If the token verification fails, return false
    return false;
  }
}
router.get(isAuth);

async function isAuth(req, res) {
  const refreshToken = req.cookies.refreshToken;
  const accessToken = req.cookies.accessToken;
  if (isValidToken(refreshToken)) {
    if (isValidToken(accessToken)) {
      return res.send(true);
    } else {
      const user = jwt.decode(refreshToken, "process.env.JWT_SECRET");
      //   console.log({ user });
      const newAccessToken = jwt.sign(
        { userId: user.userId },
        "process.env.JWT_SECRET_KEY"
      );

      res.setHeader(
        "Set-Cookie",
        serialize("accessToken", newAccessToken, {
          httpOnly: true,
          maxAge: 2 * 60 * 60,
          sameSite: "strict",
          path: "/",
        })
      );
      return res.json(true);
    }
  }
  console.log("ghana");
  return res.send(false);
}

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
