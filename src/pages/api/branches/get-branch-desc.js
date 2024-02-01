import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../../prisma/constant";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { user: user } = await getServerSession(req, res, authOptions);

      if (user?.role_code !== "SA") {
        const branch = await prisma.branch.findUnique({
          select: {
            name: true,
          },
          where: {
            id: user?.branch_id,
          },
        });
        // console.log({ branch, user });
        res.send(branch?.name);
      } else {
        res.send("");
      }
    } catch (error) {
      console.log(error);
    }
  }
}
