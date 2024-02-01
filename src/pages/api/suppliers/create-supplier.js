import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
const router = createRouter();
router.post(async (req, res) => {
  const { name, email, address, phone, balance } = req.body;

  try {
    const { user: user } = await getServerSession(req, res, authOptions);
    const newSupplier = await prisma.supplier.create({
      data: {
        name,
        address,
        email,
        phone,
        created_by: user?.id,
      },
    });

    if (!newSupplier) {
      return res.status(500).json({ message: "Registration failed" });
    }

    res.status(200).json({ message: "Supplier added successfully" });
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
