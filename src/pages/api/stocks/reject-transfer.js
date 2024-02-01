import { getServerSession } from "next-auth";
import { prisma } from "../../../../prisma/constant";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { user } = await getServerSession(req, res, authOptions);
      const { role_code } = user;
      if (role_code === "A" || role_code === "S") {
        const {
          id,
          initiated_by,
          trans_branch,
          receiving_branch,
          products,
          key,
        } = req.body;

        await prisma.transfer.update({
          where: {
            id,
          },
          data: {
            status: "REJECTED",
          },
        });

        await Promise.all([
          prisma.notification.create({
            data: {
              type: "RejTrans",
              type_id: id,
              receiving_branch: receiving_branch,
              sender: user?.id,
            },
          }),

          prisma.notification.create({
            data: {
              type: "RejTrans",
              type_id: id,
              receipient: "admin",
              sender: user?.id,
            },
          }),
        ]);
        return res
          .status(201)
          .json({ message: "Goods have been rejected successfully" });
      } else {
        res
          .status(204)
          .json({ message: "You are not qualified to do this operation" });
      }
    } catch (error) {
      console.log(error);
      res.status(205).json({ message: "Internal Error" });
    }
  } else {
    res.status(405).json("Method not allowed");
  }
}
