import { getServerSession } from "next-auth";
import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
import { authOptions } from "../auth/[...nextauth]";
const router = createRouter();
router.post(async (req, res) => {
  const { key, id, branch_code, category, dateRange } = req.body;

  try {
    const { user: user } = await getServerSession(req, res, authOptions);

    const { branch_id, role_code } = user;
    if (key === "details") {
      const debtDetail = await prisma.debt.findUnique({
        select: {
          repayments: true,
          created_at: true,
          status: true,
          sale: {
            select: {
              products: {
                select: {
                  product: {
                    select: {
                      name: true,
                      unit: true,
                    },
                  },
                  quantity: true,
                  unit_price: true,
                },
              },
              sale_id: true,
              status: true,
              total_amount: true,
              amount_paid: true,
              discount: true,
              buyer_name: true,
            },
          },
        },

        where: {
          id,
        },
      });

      return res.status(200).json(debtDetail);
    }

    let startDate;
    let endDate;
    if (dateRange) {
      console.log(dateRange);
      startDate = new Date(dateRange[0]);
      startDate.setHours(0, 0, 0, 0); // Set to the start of the day

      endDate = new Date(dateRange[1]);
      endDate.setHours(23, 59, 59, 999);
    }
    const debt = await prisma.debt.findMany({
      select: {
        id: true,
        sale: {
          select: {
            buyer_name: true,
            buyer_phone: true,
            amount_paid: true,
            total_amount: true,
            branch: {
              select: {
                name: true,
              },
            },
          },
        },
        created_at: true,
        status: true,
      },

      orderBy: {
        created_at: "desc",
      },
      where: {
        sale: {
          branch_id: branch_id ?? undefined,
          ...(dateRange
            ? {
                created_at: {
                  gte: startDate, // Start of the specified day
                  lt: endDate, // End of the day
                },
              }
            : {}),
        },
      },
    });

    res.status(200).json(debt);
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
