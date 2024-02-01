import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
const router = createRouter();

router.post(async (req, res) => {
  try {
    const {
      total_amount,
      amount_paid,
      sale_id,
      discount,
      tbc,
      status,
      return_reason,
      original_sale_id,
      initiated_by,
      branch_id,
      buyer_name,
      buyer_address,
      buyer_phone,
      products,
    } = req.body;

    if (status === "RETURNED") {
      const isReturned = await prisma.sale.count({
        where: {
          original_sale_id,
        },
      });
      if (isReturned > 0) {
        return res.status(201).json({
          message: "This sale has already been returned",
        });
      }
      const todayRevenue = await prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          createdBy: {
            branch_id,
          },
          created_at: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of the day
            lte: new Date(new Date().setHours(23, 59, 59, 999)), // End of the day
          },
        },
      });
      // console.log({ todayRevenue });
      if (todayRevenue?._sum?.amount < total_amount) {
        return res.status(201).json({
          message: "You do not have enough cash to perform a return sale",
        });
      }
      // return;
    }

    if (!tbc) {
      for (const product of products) {
        const existingStock = await prisma.stock.findFirst({
          where: {
            product_id: product.product_id,
            branch_id,
          },
        });

        // if (!existingStock || existingStock.quantity < product.quantity) {
        //   return res
        //     .status(400)
        //     .json({ error: "Insufficient stock for one or more products" });
        // }

        if (status === "RETURNED") {
          // Deduct the sold quantity from stock
          await prisma.stock.update({
            where: {
              id: existingStock.id,
            },
            data: {
              quantity: {
                increment: product.quantity,
              },
            },
          });
        } else {
          await prisma.stock.update({
            where: {
              id: existingStock.id,
            },
            data: {
              quantity: {
                decrement: product.quantity,
              },
            },
          });
        }
      }
    }

    const newSale = await prisma.sale.create({
      data: {
        total_amount: status === "RETURNED" ? -total_amount : total_amount,
        amount_paid,
        discount,
        status:
          status === "RETURNED"
            ? "RETURNED"
            : total_amount > amount_paid
            ? "CREDIT"
            : tbc
            ? "TBC"
            : "COMPLETED",
        sale_id,
        ...(tbc ? { isCollected: { status: "No" } } : {}),
        initiator: {
          connect: {
            id: initiated_by,
          },
        },
        branch: {
          connect: { id: branch_id },
        },
        buyer_address,
        buyer_name,
        buyer_phone,
        return_reason,
        ...(original_sale_id
          ? {
              original_sale: {
                connect: {
                  sale_id: original_sale_id,
                },
              },
            }
          : {}),
        products: {
          create: products.map((product) => ({
            product: {
              connect: { id: product.product_id },
            },
            quantity: product.quantity,
            unit_price: parseFloat(product.unit_price),
            cost_price: product?.cost_price,
          })),
        },
      },
    });

    if (total_amount > amount_paid && status !== "RETURNED") {
      await prisma.debt.create({
        data: {
          sale_id: newSale.sale_id,
          status: "Owing",
        },
      });
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        type: "SALES",
        createdBy: {
          branch_id,
        },
        created_at: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of the day
          lte: new Date(new Date().setHours(23, 59, 59, 999)), // End of the day
        },
      },
    });

    if (transaction) {
      await prisma.transaction.update({
        where: {
          id: transaction?.id,
        },
        data: {
          amount:
            status === "RETURNED"
              ? {
                  decrement: total_amount,
                }
              : { increment: amount_paid },
        },
      });
    } else {
      await prisma.transaction.create({
        data: {
          amount: amount_paid,
          type: "SALES",
          initiated_by,
          io: "I",
        },
      });
    }

    res.status(200).json({ message: "Sales added successfully" });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
