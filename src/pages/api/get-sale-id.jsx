import { getServerSession } from "next-auth";
import { prisma } from "../../../prisma/constant";
import { createRouter } from "next-connect";
import { authOptions } from "./auth/[...nextauth]";
const router = createRouter();
router.post(async (req, res) => {
  const { user: user } = await getServerSession(req, res, authOptions);
  const { branch_id } = user;

  try {
    const targetDate = new Date();
    function formatIntegerWithLeadingZeros(number) {
      const numberString = number.toString();
      const zeroCount = Math.max(3 - numberString.length, 0);
      const leadingZeros = "0".repeat(zeroCount);
      return leadingZeros + numberString;
    }
    function generateSaleID(branchID, salesNumber) {
      const currentDate = new Date();
      const year = currentDate.getFullYear() % 100; // Last two digits of the year
      const month = currentDate.getMonth() + 1; // Month is zero-based, so we add 1
      const day = currentDate.getDate();
      const formattedMonth = month < 10 ? `0${month}` : `${month}`;
      const formattedDay = day < 10 ? `0${day}` : `${day}`;

      const saleId = `${year}${formattedMonth}${formattedDay}${branchID}${salesNumber}`;

      return saleId;
    }
    const branch = await prisma.branch.findFirst({
      select: {
        code: true,
      },
      where: {
        id: branch_id,
      },
    });
    const count = await prisma.sale.count({
      where: {
        branch_id,
        created_at: {
          gte: new Date(
            targetDate.getFullYear(),
            targetDate.getMonth(),
            targetDate.getDate()
          ), // Start of the target date
          lt: new Date(
            targetDate.getFullYear(),
            targetDate.getMonth(),
            targetDate.getDate() + 1
          ), // Start of the next day
        }, // You can specify your condition here
      },
    });
    const saleNumber = count + 1;
    console.log(formatIntegerWithLeadingZeros(count + 1));
    const saleId = generateSaleID(
      branch?.code,
      formatIntegerWithLeadingZeros(saleNumber)
    );
    return res.send(`${saleId}`);
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
