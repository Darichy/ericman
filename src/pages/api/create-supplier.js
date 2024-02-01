// import type { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/utils/constants";
import { prisma } from "../../../prisma/constant";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { createRouter, expressWrapper } from "next-connect";
const router = createRouter();

router.post(async (req, res) => {
  const { name, address, email, balance, phone } = req.body;

  try {
    const supplier = await prisma.supplier.create({
      data: {
        name,
        phone,
        email,
        address,
        balance,
      },
    });

    res.status(200).json({ message: "Supplier added successfully" });
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
