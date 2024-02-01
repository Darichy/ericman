import { prisma } from "../../../../prisma/constant";
import { createRouter } from "next-connect";
const router = createRouter();
router.post(async (req, res) => {
  const { prevCode, code, name } = req.body;
  // return console.log(req.body);
  try {
    const updatedBranch = await prisma.branch.update({
      where: {
        code: prevCode,
      },
      data: { code, name },
    });

    if (!updatedBranch) {
      return res.status(500).json({ message: "Registration failed" });
    }

    res.status(200).json({ message: "Branch updated successfully" });
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
