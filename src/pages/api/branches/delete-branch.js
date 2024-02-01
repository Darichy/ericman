import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
const router = createRouter();
router.post(async (req, res) => {
  const { code } = req.body;

  try {
    await prisma.branch.delete({
      where: {
        code,
      },
    });

    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    if (error.code === "P2014") {
      return res.status(201).json({
        message: "Cannot complete action. Branch has dependent records.",
      });
    }
    console.error("Error during registration:", error);
    return res.status(201).json({ message: "Internal server error" });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
