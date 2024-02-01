import { prisma } from "../../../../prisma/constant";
import { createRouter, expressWrapper } from "next-connect";
import bcrypt from "bcrypt";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
const router = createRouter();

const targetDate = new Date();

router.post(async (req, res) => {
  const { user: user } = await getServerSession(req, res, authOptions);
  try {
    // console.log(user);
    const { role_code, branch_id } = user;
    const { supply_id, dateRange } = req.body;
    // console.log({ supply_id, branch_id });
    const showProductSumm =
      role_code === "SA" || role_code === "A"
        ? {
            products: true,
          }
        : {};
    const showBranches =
      role_code === "SA" || role_code === "A"
        ? {
            branch: {
              select: {
                id: true,
                name: true,
              },
            },
          }
        : {};
    // console.log({ role_code });
    if (supply_id) {
      const supply = await prisma.supplies.findUnique({
        select: {
          ...showProductSumm,
          // products: true,
          supplier_address: true,
          supplier_name: true,
          supplier_email: true,
          supplier_phone: true,
          distributions: {
            select: {
              id: true,
              calc_unit_cost: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  unit: true,
                },
              },
              ...showBranches,
              quantity: true,
              selling_price: true,
              status: true,
            },

            where: {
              branch_id: branch_id ?? undefined,
            },
          },
          createdBy: {
            select: {
              branch_id: true,
            },
          },
        },
        where: {
          id: supply_id,
        },
      });

      const supp = {
        ...supply,
        sender: supply?.createdBy?.branch_id ?? "admin",
      };
      delete supp?.createdBy;
      // console.log({ supp });
      return res.status(200).json(supp);
    }

    let startDate;
    let endDate;
    // const limit = dateRange ? {} : { take: 30 };
    if (dateRange) {
      startDate = new Date(dateRange[0]);
      startDate.setHours(0, 0, 0, 0); // Set to the start of the day

      endDate = new Date(dateRange[1]);
      endDate.setHours(23, 59, 59, 999);
    }

    const drawings = await prisma.drawings.findMany({
      select: {
        id: true,
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        quantity: true,
        stock_as_at: true,
        reason: true,
        created_at: true,
        createdBy: {
          select: {
            branch: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      where: {
        createdBy: {
          branch_id: branch_id ?? undefined,
        },

        ...(dateRange
          ? {
              created_at: {
                gte: startDate, // Start of the day
                lt: endDate,
              },
            }
          : {}),
      },
      orderBy: {
        created_at: "desc",
      },

      ...(dateRange ? {} : { take: 30 }),
    });
    console.log({ drawings });
    res.status(200).json(drawings);
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
