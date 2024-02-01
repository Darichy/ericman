import { prisma } from "../../../../prisma/constant";
import { createRouter, expressWrapper } from "next-connect";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
const router = createRouter();

router.post(async (req, res) => {
  try {
    const { quantity, reason, stock_as_at, product_id, edit, id, oldQuantity } =
      req.body;
    // return console.log("hit", req.body);
    const { user: user } = await getServerSession(req, res, authOptions);
    const { branch_id } = user;
    if (edit) {
      await Promise.all([
        prisma.drawings.update({
          data: {
            quantity,
            reason,
            stock_as_at,
            product_id,
            created_by: user?.id,
          },
          where: {
            id,
          },
        }),

        prisma.stock.update({
          data: {
            quantity: {
              increment: oldQuantity,
            },
          },
          where: {
            product_id_branch_id: {
              branch_id,
              product_id,
            },
          },
        }),

        prisma.stock.update({
          data: {
            quantity: {
              decrement: quantity,
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
        message: "Withdrawal Changes have been saved successfully",
      });
    }
    await Promise.all([
      prisma.drawings.create({
        data: {
          quantity,
          reason,
          stock_as_at,
          product_id,
          created_by: user?.id,
        },
      }),

      prisma.stock.update({
        data: {
          quantity: {
            decrement: quantity,
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
      message: "Product withdrawal recorded successfully",
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
