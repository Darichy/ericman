// import type { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/utils/constants";
import { prisma } from "../../../prisma/constant";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { createRouter, expressWrapper } from "next-connect";
const router = createRouter();

router.post(login);

async function login(req, res) {
  const { username, password, email, phone, branch_id, role_code } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        username: username,
        full_name: username,
        password: hashedPassword,
        email,
        phone,
        branch_id,
        role_code,
      },
    });

    if (!newUser) {
      return res.status(500).json({ message: "Registration failed" });
    }

    // Generate an access token
    // const accessToken = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
    //   expiresIn: "3h",
    // });

    // res.setHeader(
    //   "Set-Cookie",
    //   cookie.serialize("accessToken", accessToken, {
    //     httpOnly: true,
    //     maxAge: 3 * 60 * 60, // 3 hours in seconds
    //   })
    // );

    return res.json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
