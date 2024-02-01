import { getServerSession } from "next-auth";
import { prisma } from "../../../../prisma/constant";
import { createRouter, expressWrapper } from "next-connect";
import { authOptions } from "../auth/[...nextauth]";
const router = createRouter();

router.post(async (req, res) => {
  const { user: user } = await getServerSession(req, res, authOptions);
  const { branch_id } = user;
  try {
    const { query, key } = req.body;
    // console.log(req.body.query, "gha");
    if (key === "All") {
      const products = await prisma.product.findMany({
        orderBy: {
          created_at: "desc",
        },
      });
      return res.status(200).json(products);
    }
    if (key === "supply") {
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          unit: true,
        },
        where: {
          name: {
            mode: "insensitive",
            contains: query,
          },
        },
      });

      return res.status(200).json(products);
    }
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        unit: true,
      },
      where: {
        name: {
          mode: "insensitive",
          contains: query,
        },
        stock: {
          some: {
            branch_id: branch_id ?? undefined,
          },
        },
      },
    });
    return res.status(200).json(products);
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
