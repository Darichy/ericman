import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
const router = createRouter();
router.post(async (req, res) => {
  const { id, name, address, phone, balance, created_by } = req.body;

  try {
    const newCustomer = await prisma.customer.update({
      where: {
        id,
      },
      data: { name, address, phone, balance: parseFloat(balance), created_by },
    });

    if (!newCustomer) {
      return res.status(500).json({ message: "Registration failed" });
    }

    res.status(200).json({ message: "Customer updated successfully" });
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
