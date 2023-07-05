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
import authRoutes from "./auth/authRoutes";
app.use("/auth", authRoutes);
// - USER ROUTES
import userRoutes from "./routes/user/userRoutes"
app.use("/u", utils.authMid, userRoutes);
// - REGISTER RECYCLE ROUTES
import registerRecycleRoutes from "./routes/registerRecycle/registerRecycleRoutes";
app.use("/r", utils.authMid, registerRecycleRoutes)

app.listen("8080", () => {
  console.log(
    utils.colors.magenta(
      `::::::::::: :::::::::      :::      ::::::::  :::    :::     :::     ::::::::: ::::::::::: \r\n    :+:     :+:    :+:   :+: :+:   :+:    :+: :+:    :+:   :+: :+:   :+:    :+:    :+:     \r\n    +:+     +:+    +:+  +:+   +:+  +:+        +:+    +:+  +:+   +:+  +:+    +:+    +:+     \r\n    +#+     +#++:++#:  +#++:++#++: +#++:++#++ +#++:++#++ +#++:++#++: +#++:++#+     +#+     \r\n    +#+     +#+    +#+ +#+     +#+        +#+ +#+    +#+ +#+     +#+ +#+           +#+     \r\n    #+#     #+#    #+# #+#     #+# #+#    #+# #+#    #+# #+#     #+# #+#           #+#     \r\n    ###     ###    ### ###     ###  ########  ###    ### ###     ### ###       ########### `
    )
  );
  console.log();
});
