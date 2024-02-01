import { getServerSession } from "next-auth";
import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
import { authOptions } from "../auth/[...nextauth]";
const router = createRouter();

router.post(async (req, res) => {
  const { user: user } = await getServerSession(req, res, authOptions);

  const { branch_id, role_code } = user;
  const { key } = req.body;
  try {
    if (key === "search") {
      console.log(req.query);
      const customers = await prisma.customer.findMany({
        select: {
          id: true,
          name: true,
          phone: true,
          address: true,
        },
        where: {
          name: {
            mode: "insensitive",
            contains: req.query.search,
          },
          createdBy: {
            branch_id,
          },
        },
      });

      return res.status(200).json(customers);
    }
    const customers = await prisma.customer.findMany({
      where: {
        createdBy: {
          branch_id: branch_id ?? undefined,
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
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
    });

    res.status(200).json(customers);
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
