import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../../prisma/constant";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      //   const { user: user } = await getServerSession(req, res, authOptions);
      const { id, type, amount, description, io } = req.body;
      console.log(req.body);
      await prisma.transaction.update({
        where: {
          id,
        },
        data: {
          description,
          amount: io === "O" ? -parseFloat(amount) : parseFloat(amount),
          //   : io === "O" ? -parseFloat(amount) : parseFloat(amount),
          type,
          io,
        },
      });

      res.status(201).json({ message: "Transaction updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Something went wrong" });
    }
  } else {
    res.status(405).json("Method not allowed");
  }
}
