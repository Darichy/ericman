import { prisma } from "../../../prisma/constant";
import { createRouter, expressWrapper } from "next-connect";
import bcrypt from "bcrypt";
const router = createRouter();

router.post(async (req, res) => {
  try {
    const { phone_number } = req.body;

    async function run() {
      const resp = await fetch(`https://smsc.hubtel.com/v1/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " + Buffer.from("ssvjlyqq:eakzpgfb").toString("base64"),
        },
        body: JSON.stringify({
          from: "Yekoben Trading Enterprise",
          to: "233248139584",
          content:
            "You've been created as SuperAdmin at Yekoben with username and password",
        }),
      });

      const data = await resp.json();
      console.log(data);
    }

    run();

    res.status(200).json({ message: "SMS sent successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
