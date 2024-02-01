import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
const router = createRouter();
router.post(async (req, res) => {
  const { user: user } = await getServerSession(req, res, authOptions);

  const { id } = user;
  const { name, address, phone, balance, created_by } = req.body;

  try {
    const newCustomer = await prisma.customer.create({
      data: {
        name,
        address,
        phone,
        balance: parseFloat(balance),
        created_by: id,
      },
    });

    if (!newCustomer) {
      return res.status(500).json({ message: "Registration failed" });
    }

    res.status(200).json({ message: "Customer added successfully" });
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
