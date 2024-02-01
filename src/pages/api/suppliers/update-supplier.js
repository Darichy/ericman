import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
const router = createRouter();
router.post(async (req, res) => {
  const { id, name, address, phone, email } = req.body;

  try {
    const newSupplier = await prisma.supplier.update({
      where: {
        id,
      },
      data: { name, address, phone, email },
    });

    if (!newSupplier) {
      return res.status(500).json({ message: "Registration failed" });
    }

    res.status(200).json({ message: "Supplier updated successfully" });
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
