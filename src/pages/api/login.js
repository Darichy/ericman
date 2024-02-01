// import type { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/utils/constants";
import { prisma } from "../../../prisma/constant";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// import cookie from "cookie";
import { serialize } from "cookie";
import { createRouter, expressWrapper } from "next-connect";
import { signJwt } from "@/utils/jwt";
const router = createRouter();

router.post(login);

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: { username },
    });
    if (user.active === false) {
      res
        .status(400)
        .send({
          success: false,
          message: "This account has been blocked.. Contact administrator ",
        });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, email, phone, full_name, ...rest } = user;

      // const accessToken = signJwt(rest);
      const result = {
        ...rest,
      };
      return res.send(result);
    } else {
      res
        .status(400)
        .send({ success: false, message: "Invalid login credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
