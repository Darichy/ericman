import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../../prisma/constant";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { user: user } = await getServerSession(req, res, authOptions);

      await prisma.notification.updateMany({
        where: {
          isViewed: false,
          ...(user?.role_code === "SA"
            ? { receipient: "admin" }
            : { receiving_branch: user?.branch_id }),
        },
        data: {
          isViewed: true,
        },
      });

      return res.send({ message: "Viewed successfully" });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).json("Method not allowed");
  }
}
