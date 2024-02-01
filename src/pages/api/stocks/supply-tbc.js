import { prisma } from "../../../../prisma/constant";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { createRouter, expressWrapper } from "next-connect";
const router = createRouter();
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

router.post(async (req, res) => {
  const { selectedRows } = req.body;
  try {
    const updatedTBC = selectedRows?.map(async (i) => {
      await prisma.stock.update({
        where: {
          product_id_branch_id: {
            branch_id: i?.branch_id,
            product_id: i?.product_id,
          },
        },
        data: {
          quantity: {
            decrement: i?.quantity,
          },
        },
      });

      await prisma.sale.update({
        where: {
          sale_id: i?.sale_id,
        },
        data: {
          status: "COMPLETED",
          isCollected: { status: "Yes", date: new Date() },
        },
      });
    });

    await Promise.all(updatedTBC);

    res.status(200).json({ message: "TBC goods supplied successfully" });
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
