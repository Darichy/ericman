import { getServerSession } from "next-auth";
import { createRouter } from "next-connect";

import { prisma } from "../../../prisma/constant";
import { compare } from "bcrypt";
import { authOptions } from "./auth/[...nextauth]";
const router = createRouter();
router.post(async (req, res) => {
  const { user: user } = await getServerSession(req, res, authOptions);
  const { password } = req.body;

  try {
    const response = await prisma.user.findUnique({
      select: {
        password: true,
      },
      where: {
        username: user.username,
      },
    });

    // console.log({ response, password });
    if (user && (await compare(password, response.password))) {
      res.status(200).json({ message: "Valid password" });
    } else {
      res.status(201).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(200).json({ message: "Internal server error" });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
