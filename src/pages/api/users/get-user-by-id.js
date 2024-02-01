import { prisma } from "../../../../prisma/constant";
import { createRouter, expressWrapper } from "next-connect";
const router = createRouter();

router.post(async (req, res) => {
  try {
    const { id } = req.body;
    // const users = await prisma.users.findMany();

    const user = await prisma.user.findFirst({
      select: {
        id: true,
        full_name: true,
        username: true,
        email: true,
        phone: true,
        branch: {
          select: {
            name: true,
            id: true,
          },
        },
        role: {
          select: {
            description: true,
            code: true,
          },
        },
        // password: true,
      },
      where: {
        username: id,
      },
    });

    res.status(200).json(user);
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
