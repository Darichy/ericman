import { getServerSession } from "next-auth";
import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
import { authOptions } from "../auth/[...nextauth]";
const router = createRouter();
router.post(async (req, res) => {
  const { user: user } = await getServerSession(req, res, authOptions);
  const { description, amount, type, io } = req.body;

  try {
    await prisma.transaction.create({
      data: {
        initiated_by: user?.id,
        description,
        amount: io === "O" ? -parseFloat(amount) : parseFloat(amount),
        type,
        io,
      },
    });

    res.status(200).json({ message: "Transaction added successfully" });
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
