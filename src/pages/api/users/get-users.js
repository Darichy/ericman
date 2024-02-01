import { prisma } from "../../../../prisma/constant";
import { createRouter, expressWrapper } from "next-connect";
const router = createRouter();

router.get(async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role_code: {
          not: "SA",
        },
      },
      select: {
        full_name: true,
        username: true,
        email: true,
        active: true,
        branch: {
          select: {
            name: true,
            id: true,
          },
        },
        role: {
          select: {
            description: true,
          },
        },
      },
    });

    res.status(200).json(users);
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
