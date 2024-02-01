import { prisma } from "../../../../prisma/constant";
import { createRouter, expressWrapper } from "next-connect";
const router = createRouter();
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

router.post(async (req, res) => {
  const { selling_price, cost_price, product_id, branch_id } = req.body;
  try {
    // const { user: user } = await getServerSession(req, res, authOptions);
    await prisma.stock.update({
      where: {
        product_id_branch_id: {
          product_id,
          branch_id,
        },
      },
      data: {
        selling_price,
        cost_price,
      },
    });

    res.status(200).json({ message: "Branch stock updated successfully" });
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
