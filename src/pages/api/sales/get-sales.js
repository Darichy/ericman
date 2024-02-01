import { prisma } from "../../../../prisma/constant";
import { createRouter, expressWrapper } from "next-connect";
// import bcrypt from "bcrypt";
// import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
const router = createRouter();

const dayToFetch = new Date();

router.post(async (req, res) => {
  const { user: user } = await getServerSession(req, res, authOptions);

  const { branch_id, role_code } = user;
  const { key, filters } = req.body;

  // Replace with the desired date
  if (key === "debtors") {
    const debtors = await prisma.sale.findMany({
      where: {
        branch_id: branch_id ?? undefined,
        status: "CREDIT",
      },
      select: {
        sale_id: true,
        created_at: true,
        total_amount: true,
        amount_paid: true,
        buyer_name: true,
        buyer_phone: true,
      },
    });
    console.log({ fromfilters: debtors });
    return res.status(201).json(debtors);
  }
  if (key === "get-stat") {
    const results = await Promise.all([
      // Get Today's Total sales
      prisma.sale.aggregate({
        where: {
          branch_id: branch_id ?? undefined,
          created_at: {
            gte: new Date(dayToFetch.setHours(0, 0, 0, 0)),
            lt: new Date(dayToFetch.setHours(23, 59, 59, 999)), // Start of the day
          },
        },
        _sum: {
          total_amount: true,
        },
      }),

      //Get Total Credit sales
      prisma.debt.findMany({
        where: {
          sale: {
            branch_id: branch_id ?? undefined,
          },
          status: "Owing",
        },
        select: {
          sale: {
            select: {
              total_amount: true,
              amount_paid: true,
            },
          },
        },
      }),
    ]);
    console.log({
      dooo: results[1],
    });
    const totalDebit = results[1]?.reduce((ac, i) => {
      ac += i?.sale?.total_amount - i?.sale?.amount_paid;
      return ac;
    }, 0);

    return res.status(200).json({
      todaySales: results[0]?._sum?.total_amount ?? 0.0,
      creditSales: totalDebit,
    });
  }

  if (key === "get-chart") {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    try {
      const sales = await prisma.transaction.findMany({
        select: {
          amount: true,
          created_at: true,
        },
        where: {
          type: "SALES",
          createdBy: {
            branch_id: branch_id ?? undefined,
          },
          created_at: {
            gte: oneMonthAgo,
            lte: today,
          },
        },
        orderBy: {
          created_at: "asc",
        },
      });
      console.log("Sales for the past month:", sales);
      return res.send({ salesPerformance: sales });
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  }

  if (key === "get-profit") {
    const daysSales = await prisma.saleProduct.findMany({
      where: {
        sale: {
          branch_id: branch_id ?? undefined,
          created_at: {
            gte: new Date(dayToFetch.setHours(0, 0, 0, 0)),
            lt: new Date(dayToFetch.setHours(23, 59, 59, 999)),
          },
        },
      },
      select: {
        sale_id: true,
        quantity: true,
        unit_price: true,
        cost_price: true,
        sale: {
          select: {
            discount: true,
            amount_paid: true,
            total_amount: true,
            status: true,
          },
        },
      },
    });
    let profit = 0;
    console.log({
      daysSales,
      sale: daysSales[0]?.sale?.status,
      sale: daysSales[1]?.sale?.status,
    });
    let sale_id;
    daysSales?.forEach((i) => {
      if (i?.sale?.status !== "RETURNED") {
        if (sale_id !== i.sale_id) {
          profit -= i.sale.discount;
        }
        profit += i?.quantity * i.unit_price - i?.quantity * i.cost_price;
        sale_id = i.sale_id;
      } else {
        return;
      }
    });

    return res.status(200).json(profit);
  }

  if (filters) {
    const { dateRange, key } = filters;
    console.log(dateRange);
    const startDate = new Date(dateRange[0]);
    startDate.setHours(0, 0, 0, 0); // Set to the start of the day

    const endDate = new Date(dateRange[1]);
    endDate.setHours(23, 59, 59, 999);
    const sales = await prisma.saleProduct.findMany({
      where: {
        sale: {
          created_at: {
            gte: startDate, // Start of the specified day
            lt: endDate, // End of the day
          },
          branch_id: branch_id ?? undefined,
          ...(key == "returnSearch"
            ? {
                status: "COMPLETED",
              }
            : {}),
          ...(key == "tbc"
            ? {
                isCollected: {
                  not: null,
                },
              }
            : {}),
        },
      },

      select: {
        id: true,
        sale_id: true,
        unit_price: true,
        quantity: true,
        sale: {
          select: {
            amount_paid: true,
            total_amount: true,
            buyer_name: true,
            created_at: true,
            status: true,
            ...(key == "tbc"
              ? {
                  isCollected: true,
                }
              : {}),
            branch: {
              select: {
                name: true,
              },
            }, // Include branch details
          },
        },
        product: {
          select: {
            name: true,
            unit: true, // Include product_name
          },
        },
      },
      orderBy: {
        sale: {
          created_at: "desc",
        },
      },
    });
    console.log({ fromfilters: sales });
    return res.status(201).json({ sales: sales });
  }

  const showCostP =
    role_code === "SA" || role_code === "A" ? { cost_price: true } : {};

  const sales = await prisma.saleProduct.findMany({
    where: {
      sale: {
        ...(key === "tbc"
          ? {
              isCollected: {
                not: null,
              },
            }
          : {
              created_at: {
                gte: new Date(dayToFetch.setHours(0, 0, 0, 0)), // Start of the day
                lt: new Date(dayToFetch.setHours(23, 59, 59, 999)),
                // End of the day
              },
            }),
        branch_id: branch_id ?? undefined,
      },
    },

    select: {
      id: true,
      sale_id: true,
      ...(key === "tbc"
        ? {
            product_id: true,
          }
        : {}),
      unit_price: true,
      quantity: true,

      ...showCostP,

      sale: {
        select: {
          ...(key === "tbc"
            ? {
                branch_id: true,
              }
            : {}),
          amount_paid: true,
          total_amount: true,
          status: true,
          created_at: true,
          isCollected: true,
          branch: {
            select: {
              name: true,
            },
          }, // Include branch details
        },
      },
      product: {
        select: {
          name: true,
          unit: true, // Include product_name
        },
      },
    },
    orderBy: {
      sale: {
        created_at: "desc",
      },
    },
  });

  // console.log("Sales products for the day from all branches:", sales);

  res.status(201).json({ sales: sales });
  // console.log("Sales for the day with products and branch details:", sales);
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
