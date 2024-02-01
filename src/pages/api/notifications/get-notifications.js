import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../../prisma/constant";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { user: user } = await getServerSession(req, res, authOptions);
      const { branch_id, role_code } = user;
      const { key } = req.body;

      if (key === "count") {
        const unViewedNotification = await prisma.notification.count({
          where: {
            ...(role_code !== "SA"
              ? { receiving_branch: branch_id }
              : { receipient: "admin" }),
            isViewed: false,
          },
        });
        console.log({ unViewedNotification });
        return res.send(unViewedNotification);
      }
      const notifications = await prisma.notification.findMany({
        select: {
          id: true,
          type: true,
          type_id: true,
          created_at: true,
          sentBy: {
            select: {
              username: true,
              branch: {
                select: {
                  name: true,
                },
              },
            },
          },
          isViewed: true,
        },
        where: {
          ...(role_code !== "SA"
            ? { receiving_branch: branch_id }
            : { receipient: "admin" }),
          // isViewed: false,
        },
        orderBy: {
          created_at: "desc",
        },

        take: 30,
      });
      res.send(notifications);
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).json("Method not allowed");
  }
}
