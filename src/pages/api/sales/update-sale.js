import { prisma } from "../../../../prisma/constant";
import { createRouter, expressWrapper } from "next-connect";
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

    // let transChange = 0;

    //Fetch the original sale
    const originalSale = await prisma.sale.findUnique({
      where: {
        sale_id: sale_id,
      },
      include: {
        products: true,
      },
    });
    // transChange +=
    //   status !== "RETURNED"
    //     ? -parseFloat(originalSale.amount_paid) + parseFloat(amount_paid)
    //     : -parseFloat(total_amount);

    // return console.log({
    //   transChange,
    //   s: originalSale.amount_paid,
    //   amount_paid,
    // });
    //Delete all sales products from previous sales
    await prisma.saleProduct.deleteMany({
      where: {
        sale_id: sale_id,
      },
    });

    const debt = await prisma.debt?.findUnique({
      where: {
        sale_id,
      },
    });
    if (debt) {
      await prisma.debt.delete({
        where: {
          sale_id,
        },
      });
    }

    //revalidate the stock quantity
    if (originalSale?.status !== "TBC") {
      const revalidatedStock = originalSale?.products?.map(async (product) => {
        await prisma.stock.update({
          where: {
            product_id_branch_id: {
              product_id: product.product_id,
              branch_id,
            },
          },
          data: {
            quantity: {
              increment: product.quantity,
            },
          },
        });
      });

      await Promise?.all(revalidatedStock);
    }

    // Calculate amount change for cash-in-hand
    // let transactionAmountChange =
    //   status === "RETURN"
    //     ? originalSale.total_amount
    //     : -originalSale.amount_paid;

    // Calculate new cash-in-hand amount
    // transactionAmountChange +=
    //   status === "RETURN" ? -total_amount : amount_paid;

    //revalidate the cash-in-hand
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
      let transChange = 0;
      transChange +=
        status !== "RETURNED"
          ? -parseFloat(originalSale.amount_paid) + parseFloat(amount_paid)
          : -parseFloat(total_amount);

      await prisma.transaction.update({
        where: {
          id: transaction?.id,
        },
        data: {
          amount: transaction.amount + transChange,
        },
      });
    }

    //Now make the new changes
    if (!tbc) {
      const stocksToUpdate = products.map(async (product) => {
        const existingStock = await prisma.stock.findFirst({
          where: {
            product_id: product.product_id,
            branch_id,
          },
        });

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
      });
      await Promise?.all(stocksToUpdate);
    }

    const newSale = await prisma.sale.update({
      where: {
        sale_id,
      },
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
        ...(tbc ? { isCollected: { status: "No" } } : { isCollected: null }),
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

    if (total_amount > amount_paid) {
      await prisma.debt.create({
        data: {
          sale_id: newSale.sale_id,
          status: "Owing",
        },
      });
    }

    res.status(201).json({ message: "Sales updated successfully" });
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
