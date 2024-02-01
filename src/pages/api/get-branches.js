import { prisma } from "../../../prisma/constant";
import { createRouter, expressWrapper } from "next-connect";
const router = createRouter();

router.get(async (req, res) => {
  try {
    const branches = await prisma.branch.findMany({
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    // console.log(branchesLov);

    res.status(200).json(branches);
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
