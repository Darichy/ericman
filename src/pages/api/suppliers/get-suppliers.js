import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
const router = createRouter();
router.post(async (req, res) => {
  try {
    const { user: user } = await getServerSession(req, res, authOptions);
    const { query } = req.body;
    const { branch_id } = user;
    if (query) {
      const suppliers = await prisma.supplier.findMany({
        where: {
          name: query,
        },
        select: {
          name: true,
          phone: true,
          email: true,
          address: true,
        },
      });

      res.status(200).json(suppliers);
    }
    const suppliers = await prisma.supplier.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        createdBy: {
          select: {
            username: true,
          },
        },
      },
    });

    res.status(200).json(suppliers);
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
