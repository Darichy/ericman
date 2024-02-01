import { getServerSession } from "next-auth";
import { prisma } from "../../../../prisma/constant";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { user: user } = await getServerSession(req, res, authOptions);
  const { branch_id, role_code } = user;
  const { id, dateRange } = req.body;
  if (req.method === "POST") {
    if (id) {
      const transfer = await prisma.transfer.findUnique({
        where: { id },
        select: {
          status: true,
          products: true,
          createdBy: {
            select: {
              branch_id: true,
            },
          },
          receiving_branch: true,
        },
      });
      return res.status(201).json(transfer);
    }

    if (dateRange) {
      const startDate = new Date(dateRange[0]);
      startDate.setHours(0, 0, 0, 0); // Set to the start of the day

      const endDate = new Date(dateRange[1]);
      endDate.setHours(23, 59, 59, 999);

      const transfers = await prisma.transfer.findMany({
        select: {
          id: true,
          createdBy: {
            select: {
              username: true,
              branch: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          status: true,
          trans_date: true,
          r_branch: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        ...(role_code !== "SA"
          ? {
              where: {
                OR: [
                  {
                    createdBy: { branch_id: branch_id ?? undefined },
                  },
                  {
                    receiving_branch: branch_id ?? undefined,
                  },
                ],
                trans_date: {
                  gte: startDate, // Start of the day
                  lt: endDate,
                  // End of the day
                },
              },
            }
          : {
              trans_date: {
                gte: startDate, // Start of the day
                lt: endDate,
                // End of the day
              },
            }),

        orderBy: {
          trans_date: "desc",
        },
      });

      res.status(201).json(transfers);
    }
    const transfers = await prisma.transfer.findMany({
      select: {
        id: true,
        createdBy: {
          select: {
            username: true,
            branch: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        status: true,
        trans_date: true,
        r_branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      ...(role_code !== "SA"
        ? {
            where: {
              OR: [
                {
                  createdBy: { branch_id: branch_id ?? undefined },
                },
                {
                  receiving_branch: branch_id ?? undefined,
                },
              ],
            },
          }
        : {}),

      orderBy: {
        trans_date: "desc",
      },
      take: 30,
    });

    res.status(201).json(transfers);
  } else {
    res.status(405).json("Internal Error");
  }
}
