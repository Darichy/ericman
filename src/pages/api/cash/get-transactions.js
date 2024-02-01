import { getServerSession } from "next-auth";
import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
import { authOptions } from "../auth/[...nextauth]";
const router = createRouter();
router.post(async (req, res) => {
  const { key, dateRange } = req.body;
  // console.log(req.body);
  const { user: user } = await getServerSession(req, res, authOptions);
  const { branch_id } = user;
  try {
    let revenues;
    const dayToFetch = new Date();

    if (dateRange) {
      // const { dateRange } = filters;

      const startDate = new Date(dateRange[0]);
      startDate.setHours(0, 0, 0, 0); // Set to the start of the day

      const endDate = new Date(dateRange[1]);
      endDate.setHours(23, 59, 59, 999);

      const transactions = await prisma.transaction.findMany({
        select: {
          id: true,
          type: true,
          amount: true,
          description: true,
          io: true,
          createdBy: {
            select: {
              branch: {
                select: {
                  name: true,
                },
              },
            },
          },
          created_at: true,
        },
        where: {
          createdBy: {
            branch_id: branch_id ?? undefined,
          },
          created_at: {
            gte: startDate, // Start of the day
            lt: endDate,
            // End of the day
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      const arr = [];
      transactions?.forEach((i) => {
        arr.push({
          id: i?.id,
          type: i?.type,
          io: i?.io,
          amount: i?.amount,
          description: i?.description,
          branch: i?.createdBy?.branch?.name,
          date: i?.created_at,
        });
      });
      console.log({ transactions, arr });
      return res.status(200).json(arr);
    }
    if (key === "get-BF") {
      const BFcount = await prisma.transaction.count({
        where: {
          type: "BF",
          created_at: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of the day
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
            // End of the day
          },
          createdBy: {
            branch_id: branch_id,
          },
        },
      });
      if (BFcount > 0) {
        return res
          .status(202)
          .json({ message: "You have already added Brought Forward" });
      } else {
        const lastSalesDate = await prisma.transaction.findFirst({
          select: {
            created_at: true,
          },
          orderBy: {
            created_at: "desc",
          },

          where: {
            createdBy: {
              branch_id,
            },

            NOT: {
              created_at: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of the day
                lt: new Date(new Date().setHours(23, 59, 59, 999)),
              },
            },
          },
        });
        // return console.log({ lastSalesDate });
        const BF = await prisma.transaction.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            created_at: {
              gte: new Date(
                new Date(lastSalesDate?.created_at).setHours(0, 0, 0, 0)
              ), // Start of the day
              lt: new Date(
                new Date(lastSalesDate?.created_at).setHours(23, 59, 59, 999)
              ),
              // End of the day
            },
            createdBy: {
              branch_id,
            },
          },
        });
        // console.log({ bf: BF?._sum?.amount, date: lastSalesDate?.created_at });
        // return;
        return res
          .status(200)
          .json({ bf: BF?._sum?.amount, date: lastSalesDate?.created_at });
      }
    }

    revenues = await prisma.transaction.findMany({
      select: {
        id: true,
        type: true,
        amount: true,
        description: true,
        type_id: true,
        io: true,
        createdBy: {
          select: {
            branch: {
              select: {
                name: true,
              },
            },
          },
        },
        created_at: true,
      },
      where: {
        createdBy: {
          branch_id: branch_id ?? undefined,
        },
        created_at: {
          gte: new Date(dayToFetch.setHours(0, 0, 0, 0)), // Start of the day
          lt: new Date(dayToFetch.setHours(23, 59, 59, 999)),
          // End of the day
        },
      },
    });

    const arr = [];
    function formatDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = date
        .toLocaleString("default", { month: "short" })
        .toUpperCase();
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    }
    let sum = 0;
    // console.log({ revenues: revenues[1] });
    // revenues[1]?.forEach((a) => {
    //   if (a?.repayments) {
    //     a?.repayments?.forEach((i) => {
    //       if (key?.toLowerCase() === "get-total") {
    //         sum += i.amount;
    //       }
    //       arr.push({
    //         id: a.id,
    //         type: "DEBT PAID",
    //         io: "I",
    //         amount: i.amount,
    //         description: "",
    //         branch: a.sale?.branch?.name,
    //         date: i?.date,
    //       });
    //     });
    //   }
    // });

    revenues?.forEach((i) => {
      if (key?.toLowerCase() === "get-total") {
        sum += i.amount;
      }
      arr.push({
        id: i?.id,
        type: i?.type,
        type_id: i?.type_id,
        io: i?.io,
        amount: i?.amount,
        description: i?.description,
        branch: i?.createdBy?.branch?.name,
        date: i?.created_at,
      });
    });

    if (key?.toLowerCase() == "get-total") {
      console.log(sum, "sum");
      return res.status(200).json(sum);
    }

    console.log({ arr });
    res.status(200).json(arr);
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
