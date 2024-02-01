import { prisma } from "../../../../prisma/constant";
import { createRouter, expressWrapper } from "next-connect";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
const router = createRouter();

router.post(async (req, res) => {
  try {
    const { id, quantity, product_id } = req.body;
    // return console.log("hit", req.body);
    const { user: user } = await getServerSession(req, res, authOptions);
    const { branch_id } = user;
    await Promise.all([
      prisma.drawings.delete({
        where: { id },
      }),

      prisma.stock.update({
        data: {
          quantity: {
            increment: quantity,
          },
        },
        where: {
          product_id_branch_id: {
            branch_id,
            product_id,
          },
        },
      }),
    ]);

    return res.status(201).json({
      message: "Product withdrawal deleted successfully",
    });
  } catch (error) {
    console.error("Error recording supply:", error);
    return res.status(205).json({ message: "Something went wrong" });
  }
  // recordSupply(initiated_by, products, distributions);
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
