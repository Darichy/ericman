import { prisma } from "../../../../prisma/constant";
import { createRouter, expressWrapper } from "next-connect";
import bcrypt from "bcrypt";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
const router = createRouter();

const targetDate = new Date();

async function getSalesStatus(branch_code) {
  const closedSale = await prisma.revenue.findFirst({
    where: {
      category: "SALES",
      branch_code,
      created_at: {
        gte: new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate()
        ), // Start of the target date
        lt: new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate() + 1
        ), // Start of the next day
      },
    },
  });
  console.log("Closed Sale Result:", closedSale);
  if (closedSale) {
    return { code: "closed", id: closedSale.id };
  } else {
    return { code: "running", id: "" };
  }
}

router.post(async (req, res) => {
  const { viewAs } = req.body;
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
              branch_id:
                (user.role_code == "A" && viewAs == "staff") ||
                user.role_code == "S"
                  ? branch_id
                  : undefined,
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
    const supplies = await prisma.supplies.findMany({
      select: {
        id: true,
        supplier_name: true,
        supply_date: true,
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
        distributions: {
          select: {
            status: true,
          },
        },
      },

      where: {
        distributions: {
          some: {
            branch_id:
              (user.role_code == "A" && viewAs == "staff") ||
              user.role_code == "S"
                ? branch_id
                : undefined,
          },
        },

        ...(dateRange
          ? {
              supply_date: {
                gte: startDate, // Start of the day
                lt: endDate,
              },
            }
          : {}),
      },
      orderBy: {
        updated_at: "desc",
      },

      ...(dateRange ? {} : { take: 30 }),
    });
    const arr = [];
    supplies.map((i) => {
      let sum = { C: 0, R: 0, N: 0 };

      i.distributions.forEach((i) => {
        if (i.status === "CONFIRMED") {
          sum.C = sum.C + 1;
        } else if (i.status === "REJECTED") {
          sum.R = sum.R + 1;
        } else {
          sum.N = sum.N + 1;
        }
      });
      let total = sum.C + sum.N + sum.R;
      arr.push({
        id: i.id,

        supplier_name: i.supplier_name,
        supply_date: i.supply_date,
        createdBy: i.createdBy,
        confirmations: {
          C: (sum.C / total) * 100,
          R: (sum.R / total) * 100,
          N: (sum.N / total) * 100,
        },
      });
    });
    // console.log({ arr, i: arr[0]?.confirmations });
    res.status(200).json(arr);
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
