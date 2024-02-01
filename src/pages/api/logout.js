import { sign } from "jsonwebtoken";
import nc, { createRouter } from "next-connect";

import { serialize } from "cookie";

const handler = createRouter();

// handler.use((req) => {
//   console.log(req.url);
// });

handler.post(async (req, res) => {
  try {
    // return console.log(req.url);
    if (req.cookies.refreshToken) {
      res.setHeader("Set-Cookie", [
        serialize("refreshToken", null, {
          httpOnly: true,
          maxAge: 0,
          sameSite: "strict",
          path: "/",
        }),
        serialize("accessToken", null, {
          httpOnly: true,
          maxAge: 0,
          sameSite: "strict",
          path: "/",
        }),
      ]);

      console.log("logout");
      res.send({ responseCode: 0x000, responseMessage: "Logout successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

export default handler.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
