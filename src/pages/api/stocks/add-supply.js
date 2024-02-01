import { prisma } from "../../../../prisma/constant";
import { createRouter, expressWrapper } from "next-connect";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
const router = createRouter();
async function deleteOldNotifications() {
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 15);

  try {
    const result = await prisma.notification.deleteMany({
      where: {
        isViewed: true,
        created_at: {
          lt: tenDaysAgo,
        },
      },
    });
    console.log("Deleted Old notifications");
  } catch (error) {
    console.log(error);
  }
}

router.post(async (req, res) => {
  try {
    const {
      key,
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
    async function notifyAdmin() {
      if (user?.role_code !== "SA") {
        await prisma.notification.create({
          data: {
            type: "Distribution",
            type_id: supply.id,
            receipient: "admin",
            sender: initiated_by,
          },
        });
      }
    }
    if (key === "reject") {
      // console.log({ distributions });
      // return;

      const rejected = distributions.map(async (i) => {
        const { id } = i;

        await prisma.distribution.update({
          where: {
            id,
          },
          data: {
            status: "REJECTED",
          },
        });
      });

      await Promise.all([
        ...rejected,
        await prisma.notification.create({
          data: {
            type: "RejDist",
            ...(sender !== "admin"
              ? { receiving_branch: sender }
              : { receipient: sender }),
            sender: user?.id,
          },
        }),
      ]);
      return res.status(201).json({
        message: "Supply rejected successfully",
      });
    }

    if (key === "confirm") {
      // console.log({ distributions });
      // return;

      const confirmed = distributions.map(async (i) => {
        const { id, product, quantity, calc_unit_cost, selling_price } = i;
        await prisma.stock.upsert({
          where: {
            product_id_branch_id: {
              product_id: product?.id,
              branch_id: user?.branch_id,
            },
          },
          create: {
            product_id: product?.id,
            branch_id: user?.branch_id,
            quantity: quantity,
            selling_price,
            cost_price: calc_unit_cost,
          },
          update: {
            quantity: {
              increment: quantity,
            },
            selling_price,
            cost_price: calc_unit_cost,
          },
        });

        await prisma.distribution.update({
          where: {
            id,
          },
          data: {
            status: "CONFIRMED",
          },
        });
      });

      await Promise.all([
        ...confirmed,
        await prisma.notification.create({
          data: {
            type: "ConDist",
            ...(sender !== "admin"
              ? { receiving_branch: sender }
              : { receipient: sender }),
            sender: user?.id,
          },
        }),
      ]);
      return res.status(201).json({
        message: "Supply confirmed and stocks updated successfully",
      });
    }
    // Create a new supplies record to represent the supply transaction
    const supply = await prisma.supplies.create({
      data: {
        initiated_by,
        products,
        supplier_name,
        supplier_phone,
      },
    });

    const arr = [];
    const alldistro = distributions?.map(async (i) => {
      const { product_id, quantity, branch_id, calc_unit_cost, selling_price } =
        i;
      if (!arr.includes(branch_id)) {
        console.log("r");

        arr.push(branch_id);

        // if (branch_id !== user?.branch_id) {
        await prisma.notification.create({
          data: {
            type: "Distribution",
            type_id: supply.id,
            receiving_branch: branch_id,
            sender: initiated_by,
          },
        });
        // }
      }
      // Create a suppliedProduct record to represent the supplied product
      await prisma.distribution.create({
        data: {
          product_id,
          quantity,
          branch_id,
          calc_unit_cost,
          selling_price,
          supply_id: supply.id,
        },
      });

      // Update the inventory for the branch by increasing the quantity
    });

    await Promise.all([...alldistro, deleteOldNotifications(), notifyAdmin()]);
    // console.log("Supply recorded successfully.");
    return res.status(201).json({
      message:
        "Supply recorded successfully. All participant branches have been notified",
    });
  } catch (error) {
    console.error("Error recording supply:", error);
    return res.status(205).json({ message: "Something went wrong" });
  }
  // recordSupply(initiated_by, products, distributions);
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
