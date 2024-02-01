import { getServerSession } from "next-auth";
import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
import { authOptions } from "../auth/[...nextauth]";
const router = createRouter();
router.post(async (req, res) => {
  const { user: user } = await getServerSession(req, res, authOptions);
  const { id } = req.body;

  try {
    await prisma.transaction.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Transaction deleted successfully" });
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
