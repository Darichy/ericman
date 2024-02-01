import { getServerSession } from "next-auth";
import { createRouter } from "next-connect";

import { prisma } from "../../../prisma/constant";
import { compare, hash } from "bcrypt";
import { authOptions } from "./auth/[...nextauth]";
const router = createRouter();
router.post(async (req, res) => {
  const { user: user } = await getServerSession(req, res, authOptions);
  const { password } = req.body;

  try {
    const hashedPassword = await hash(password, 10);
    const response = await prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: {
        username: user.username,
      },
    });

    // console.log({ response, password });

    res.status(200).json({ message: "Password has been updated successfully" });
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
