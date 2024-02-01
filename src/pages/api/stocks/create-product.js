// import type { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/utils/constants";
import { prisma } from "../../../../prisma/constant";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { createRouter, expressWrapper } from "next-connect";
const router = createRouter();
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

router.post(async (req, res) => {
  const { name, unit } = req.body;
  try {
    const count = await prisma.product.count({
      where: {
        name: {
          mode: "insensitive",
          equals: name?.trim(),
        },
      },
    });
    if (count > 0) {
      return res
        .status(202)
        .json({ message: "There's already a product with same name" });
    }
    await prisma.product.create({
      data: {
        name: name?.trim(),
        unit: unit?.trim(),
      },
    });

    return res.status(200).json({ message: "New Product added successfully" });
  } catch (error) {
    // if (error?.code === "P2002") {
    //   return res.status(202).json("There's already a product with same name");
    // }
    if (error.code === "P2002" && error.meta.target.includes("Product")) {
      // console.error("Error during registration:", error);
      return res
        .status(202)
        .json({ message: "There's already a product with same name" });
    }
    console.error("Error during registration:", error);
    return res.status(202).json({ message: "Internal server error" });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
