import { prisma } from "../../../../prisma/constant";
import { createRouter, expressWrapper } from "next-connect";
import bcrypt from "bcrypt";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const router = createRouter();

router.post(async (req, res) => {
  const { key, subKey, product_id } = req.body;
  // console.log({ branch_id, product_id });
  const { user: user } = await getServerSession(req, res, authOptions);
  const { branch_id } = user;

  try {
    if (key === "distro") {
      let products;
      products = await prisma.stock.findFirst({
        select: {
          quantity: true,
          selling_price: true,
          cost_price: true,
          product: {
            select: {
              unit: true,
            },
          },
        },
        where: { branch_id: req.body.branch_id ?? undefined, product_id },
      });
      console.log({ branch_id });
      return res.status(200).json(products);
    }
    if (key === "supply") {
      let id;
      if (subKey) {
        let response = await prisma.product.findUnique({
          select: {
            id: true,
          },
          where: { name: subKey },
        });

        id = response?.id;
      }
      const results = await Promise.all([
        await prisma.stock.aggregate({
          _sum: {
            quantity: true,
          },
          where: {
            product_id: subKey ? id : product_id,
          },
        }),
        await prisma.product.findUnique({
          select: {
            unit: true,
          },
          where: { id: subKey ? id : product_id },
        }),
      ]);
      return res
        .status(200)
        .json({ quantity: results[0]?._sum.quantity, unit: results[1]?.unit });
    }

    let products;

    // const where = branch_id ? { where: { branch_id } } : {};
    products = await prisma.stock.findMany({
      select: {
        quantity: true,
        selling_price: true,
        cost_price: !branch_id ? true : false, // Include cost_price if branch_id is provided
        product: {
          select: {
            id: true,
            name: true,
            unit: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: { branch_id: branch_id ? branch_id : undefined },
    });

    // }

    console.log(products);
    res.status(200).json({ products });
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
