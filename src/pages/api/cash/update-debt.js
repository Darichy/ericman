import { getServerSession } from "next-auth";
import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
import { authOptions } from "../auth/[...nextauth]";
const router = createRouter();
router.post(async (req, res) => {
  const { key, id, amount, repayment } = req.body;

  try {
    const { user: user } = await getServerSession(req, res, authOptions);
    if (key === "pay-debt") {
      const existingDebt = await prisma.debt.findUnique({
        where: {
          id,
        },
        select: {
          repayments: true,
          sale: {
            select: {
              amount_paid: true,
              total_amount: true,
            },
          },
        },
      });

      const newRepaymentData = { amount, date: new Date() };

      let updatedRepayments;

      if (existingDebt.repayments) {
        // If the repayments field exists, update it.
        updatedRepayments = [...existingDebt.repayments, newRepaymentData];
      } else {
        // If the repayments field is null or doesn't exist, create a new JSON object.
        updatedRepayments = [newRepaymentData];
      }

      const sum = updatedRepayments?.reduce((ac, i) => {
        ac += i?.amount;
        return ac;
      }, 0);
      const newAmountPaid = sum + existingDebt?.sale?.amount_paid;
      console.log({
        sum,
        re: updatedRepayments,
        total: existingDebt?.sale?.total_amount,
      });
      await Promise.all([
        prisma.debt.update({
          data: {
            repayments: updatedRepayments,
            status:
              newAmountPaid < existingDebt?.sale?.total_amount
                ? "Owing"
                : "Paid",
            sale: {
              update: {
                amount_paid: {
                  increment: amount,
                },
                status:
                  newAmountPaid < existingDebt?.sale?.total_amount
                    ? "CREDIT"
                    : "COMPLETED",
              },
            },
          },
          where: {
            id,
          },
        }),

        prisma.transaction.create({
          data: {
            amount: amount,
            io: "I",
            type: "PaidD",
            initiated_by: user?.id,
            type_id: id,
          },
        }),
      ]);
      return res
        .status(200)
        .json({ message: "Debt payment added successfully" });
    }

    if (key === "delRepayment") {
      const debtRepayments = await prisma.debt.findUnique({
        select: {
          repayments: true,
          created_at: true,
          // sale: {
          //   select: {
          //     amount_paid: true,
          //     total_amount: true,
          //   },
          // },
        },
        where: {
          id,
        },
      });

      const updatedRepayments = debtRepayments?.repayments?.filter(
        (i) => i?.date !== repayment?.date && i?.amount !== repayment?.amount
      );
      // const sum = updatedRepayments?.reduce((ac, i) => {
      //   ac += i?.amount;
      //   return ac;
      // }, 0);
      // const newAmountPaid = sum + debtRepayments?.sale?.amount_paid;

      const dayToFetch = new Date(repayment?.date);
      await Promise?.all([
        await prisma.debt.update({
          data: {
            repayments: updatedRepayments,
            status: "Owing",
            sale: {
              update: {
                amount_paid: {
                  decrement: repayment?.amount,
                },
                status: "CREDIT",
              },
            },
          },
          where: {
            id,
          },
        }),
        await prisma.transaction.deleteMany({
          where: {
            type_id: id,
            created_at: {
              gte: new Date(dayToFetch.setHours(0, 0, 0, 0)),
              lt: new Date(dayToFetch.setHours(23, 59, 59, 999)),
            },
          },
        }),
      ]);

      return res
        .status(200)
        .json({ message: "Repayment has been deleted successfully" });
    }

    if (key === "bad-debt") {
      await prisma.debt.update({
        data: {
          status: "BadDebt",
          sale: {
            update: {
              status: "COMPLETED",
            },
          },
        },
        where: {
          id,
        },
      });

      return res
        .status(200)
        .json({ message: "Debt has been marked as bad debt successfully" });
    }

    if (key === "revert") {
      await prisma.debt.update({
        data: {
          status: "Owing",
          sale: {
            update: {
              status: "CREDIT",
            },
          },
        },
        where: {
          id,
        },
      });

      return res
        .status(200)
        .json({ message: "Debt has been reverted successfully" });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(205).json({ message: "Something went wrong" });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
