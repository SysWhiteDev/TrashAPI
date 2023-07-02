import express, { Express, Request, Response } from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import dotenv
import "dotenv/config";

// import utils
import utils from "./services/utils";

// import routes
// - AUTH
import authRoutes from "./auth/auth";
app.use("/auth", authRoutes);

// protected route
app.get("/", utils.authMid, (req, res) => {
  res.send("ACCESS GRANTED")
})

app.listen("8080", () => {
  console.log(
    utils.colors.magenta(
      `::::::::::: :::::::::      :::      ::::::::  :::    :::     :::     ::::::::: ::::::::::: \r\n    :+:     :+:    :+:   :+: :+:   :+:    :+: :+:    :+:   :+: :+:   :+:    :+:    :+:     \r\n    +:+     +:+    +:+  +:+   +:+  +:+        +:+    +:+  +:+   +:+  +:+    +:+    +:+     \r\n    +#+     +#++:++#:  +#++:++#++: +#++:++#++ +#++:++#++ +#++:++#++: +#++:++#+     +#+     \r\n    +#+     +#+    +#+ +#+     +#+        +#+ +#+    +#+ +#+     +#+ +#+           +#+     \r\n    #+#     #+#    #+# #+#     #+# #+#    #+# #+#    #+# #+#     #+# #+#           #+#     \r\n    ###     ###    ### ###     ###  ########  ###    ### ###     ### ###       ########### `
    )
  );
  console.log();
});
