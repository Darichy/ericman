import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
const router = createRouter();
router.post(async (req, res) => {
  const { name, code } = req.body;

  try {
    const newBranch = await prisma.branch.create({
      data: { name, code },
    });

    if (!newBranch) {
      return res.status(500).json({ message: "Registration failed" });
    }

    res.status(200).json({ message: "Branch added successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    if (error.code === "P2002") {
      return res.status(200).json({ message: "Code has already been taken" });
    }
    return res.status(200).json({ message: "Something went wrong" });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
