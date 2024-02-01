import { prisma } from "../../../../prisma/constant";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id, key } = req.body;
    if (key == "saleDetails") {
      const sale = await prisma.sale.findUnique({
        select: {
          buyer_name: true,
          buyer_address: true,
          buyer_phone: true,
          products: {
            select: {
              product: {
                select: {
                  id: true,
                  name: true,
                  unit: true,
                },
              },
              quantity: true,
              unit_price: true,
              cost_price: true,
            },
          },
          status: true,
        },
        where: {
          sale_id: id,
        },
      });
      console.log({ sale, id });
      return res.status(201).json({ sale });
    }
    const select =
      key === "main"
        ? {
            select: {
              sale: {
                select: {
                  buyer_name: true,
                  total_amount: true,
                  discount: true,
                  amount_paid: true,
                  products: {
                    select: {
                      product: {
                        select: {
                          name: true,
                          unit: true,
                        },
                      },
                      unit_price: true,

                      quantity: true,
                    },
                  },
                },
              },
            },
          }
        : {
            select: {
              sale: {
                select: {
                  buyer_name: true,
                  total_amount: true,
                  discount: true,
                  amount_paid: true,
                  products: {
                    select: {
                      product: {
                        select: {
                          name: true,
                          unit: true,
                        },
                      },
                      unit_price: true,

                      quantity: true,
                    },
                  },
                },
              },
            },
          };
    const sale = await prisma.saleProduct.findUnique({
      select: {
        sale: {
          select: {
            buyer_name: true,
            buyer_address: true,
            buyer_phone: true,
            total_amount: true,
            discount: true,
            amount_paid: true,
            sale_id: true,
            created_at: true,
            status: true,
            return_reason: true,
            products: {
              select: {
                product: {
                  select: {
                    name: true,
                    unit: true,
                  },
                },
                product_id: true,
                cost_price: true,
                unit_price: true,

                quantity: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });
    // console.log({ sale });
    return res.status(201).json(sale);
  } else {
    res.status(405).json("Method not allowed");
  }
}
