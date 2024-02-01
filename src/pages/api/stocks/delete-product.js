import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
const router = createRouter();
router.post(async (req, res) => {
  const { id } = req.body;

  try {
    await prisma.product.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    if (error.code === "P2014") {
      return res.status(201).json({
        message: "Cannot complete action. Product has dependent records.",
      });
    }
    return res.status(200).json({ message: "Internal server error" });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
