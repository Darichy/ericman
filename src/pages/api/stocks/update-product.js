import { prisma } from "../../../../prisma/constant";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { createRouter, expressWrapper } from "next-connect";
const router = createRouter();
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

router.post(async (req, res) => {
  const { name, unit, id } = req.body;
  try {
    await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        unit,
      },
    });

    res.status(200).json({ message: "Product updated successfully" });
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
