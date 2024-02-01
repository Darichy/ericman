import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
const router = createRouter();
router.post(async (req, res) => {
  const { username, isActive, branch_id } = req.body;

  try {
    let count = 0;
    if (!isActive) {
      count = await prisma.user.count({
        where: {
          active: true,
          branch_id,
        },
      });
    }
    console.log({ count, branch_id });
    if (count > 0) {
      return res
        .status(201)
        .json({ message: "There is already an active user for this branch" });
    }

    const user = await prisma.user.update({
      where: {
        username,
      },
      data: {
        active: isActive ? false : true,
      },
    });

    if (!user) {
      return res.status(500).json({ message: "Operation failed" });
    }

    res.status(200).json({
      message: `User ${isActive ? "blocked" : "unblocked"} successfully`,
    });
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
