import { prisma } from "../../../../prisma/constant";
import { createRouter, expressWrapper } from "next-connect";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
const router = createRouter();

router.post(async (req, res) => {
  try {
    const {
      key,
      id,
      initiated_by,
      products,
      distributions,
      supplier_name,
      supplier_phone,
      supplier_address,
      supplier_email,
      sender,
    } = req.body;
    // return console.log("hit", req.body);
    const { user: user } = await getServerSession(req, res, authOptions);
    // return console.log("Hiiiiiiiiiiii");
    await prisma.supplies.update({
      where: {
        id,
      },
      data: {
        initiated_by,
        products,
        supplier_name,
        supplier_address,
        supplier_email,
        supplier_phone,
      },
    });

    const arr = [];
    distributions?.forEach(async (i) => {
      const { product_id, quantity, branch_id, calc_unit_cost, selling_price } =
        i;
      console.log(i, "hereeee");
      if (!arr.includes(branch_id)) {
        arr.push(branch_id);

        await prisma.notification.create({
          data: {
            type: "Distribution",
            type_id: id,
            receiving_branch: branch_id,
            sender: initiated_by,
          },
        });
      }

      // Create a suppliedProduct record to represent the supplied product
      await prisma.distribution.update({
        where: {
          id: i?.id,
        },
        data: {
          product_id,
          quantity,
          branch_id,
          calc_unit_cost,
          selling_price,
          status: "NONE",
          supply_id: id,
        },
      });
      //   console.log({ u });
      // Update the inventory for the branch by increasing the quantity
    });
    if (user?.role_code !== "SA") {
      await prisma.notification.create({
        data: {
          type: "UpdDist",
          type_id: id,
          receipient: "admin",
          sender: initiated_by,
        },
      });
    }
    // console.log("Supply recorded successfully.");
    return res.status(201).json({
      message:
        "Supply updated successfully. All participant branches have been notified",
    });
  } catch (error) {
    console.error("Error recording supply:", error);
    return res.status(205).json({ message: "Something went wrong" });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
