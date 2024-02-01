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

        if (key === "confirm") {
          const updatePromises = products.map(async (i) => {
            // Update the transferring branch (decrement the quantity)
            const updateTransBranch = prisma.stock.update({
              where: {
                product_id_branch_id: {
                  branch_id: trans_branch,
                  product_id: i.id,
                },
              },
              data: {
                quantity: {
                  decrement: i.quantity,
                },
              },
            });

            // Update the receiving branch (increment the quantity)
            const updateReceiveBranch = prisma.stock.update({
              where: {
                product_id_branch_id: {
                  branch_id: receiving_branch,
                  product_id: i.id,
                },
              },
              data: {
                quantity: {
                  increment: i.quantity,
                },
              },
            });

            // Await both updates to ensure they are executed in order
            await Promise.all([updateTransBranch, updateReceiveBranch]);
          });

          await Promise.all(updatePromises);
          await prisma.transfer.update({
            where: {
              id,
            },
            data: {
              status: "CONFIRMED",
            },
          });
          return res
            .status(201)
            .json({ message: "Goods have been accepted successfully" });
        }
        const newTransfer = await prisma.transfer.create({
          data: {
            initiated_by,
            // trans_branch,
            receiving_branch,
            products,
          },
        });

        await Promise.all([
          prisma.notification.create({
            data: {
              type: "Transfer",
              type_id: newTransfer.id,
              receiving_branch: receiving_branch,
              sender: initiated_by,
            },
          }),

          prisma.notification.create({
            data: {
              type: "Transfer",
              type_id: newTransfer.id,
              receipient: "admin",
              sender: initiated_by,
            },
          }),
        ]);

        res.status(201).json({ message: "Goods transferred successfully." });
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
