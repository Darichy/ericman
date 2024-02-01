import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
const router = createRouter();
router.post(async (req, res) => {
  const { id } = req.body;

  try {
    const newCustomer = await prisma.customer.delete({
      where: {
        id,
      },
    });

    if (!newCustomer) {
      return res.status(500).json({ message: "Deletion failed" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
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
