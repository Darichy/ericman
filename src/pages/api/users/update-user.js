import { prisma } from "../../../../prisma/constant";
import { createRouter, expressWrapper } from "next-connect";
import bcrypt from "bcrypt";
const router = createRouter();

router.post(async (req, res) => {
  try {
    const {
      id,
      full_name,
      username,
      phone,
      email,
      password,
      branch_id,
      role_code,
    } = req.body;
    let hashedPassword;
    const count = await prisma.user.count({
      where: {
        active: true,
        branch_id,
        NOT: {
          id,
        },
      },
    });
    if (count > 0) {
      return res
        .status(201)
        .json({ message: "There is already an active user for this branch" });
    }
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        full_name,
        username,
        phone,
        email,
        ...(password ? { password: hashedPassword } : {}),
        branch_id,
        role_code,
      },
    });
    console.log(req.body);

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    // console.log(error, error.code, error.meta.target);
    // if (error.code === "P2002" && error.meta.target.includes("username")) {
    //   return res.status(202).json({ message: "Username is already in use" });
    // }
    console.log(error);
    return res.status(200).json({ message: "Something went wrong" });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
