import express, { Router } from "express";
const router: Router = express.Router();

import utils from "../services/utils";

router.post("/r", (req, res) => {
  const data = req.body;

  // CHECK IF INFO IS VALID
  if (!data.name) {
    res.status(500).json({
      status: "error",
      message: "NO_NAME",
    });
    return;
  } else if (!data.passwd) {
    res.status(500).json({
      status: "error",
      message: "NO_PASSWD",
    });
    return;
  } else if (!data.email) {
    res.status(500).json({
      status: "error",
      message: "NO_EMAIL",
    });
    return;
  }

  // CHECK IF USERNAME / EMAILS EXISTS
  utils.db.query("SELECT name, email FROM users", (err, rows) => {
    if (err) {
      console.error("Error executing query:", err);
      return;
    }
    for (const user of rows) {
      if (user.name === data.name) {
        res.status(500).json({
          status: "error",
          message: "NAME_EXISTS",
        });
        return;
      }
      if (user.email === data.email) {
        res.status(500).json({
          status: "error",
          message: "EMAIL_EXISTS",
        });
        return;
      }
    }
    // ENCRYPT PASSWD
    utils.bcrypt.hash(data.passwd, 10, (err, hash) => {
      if (err) {
        console.error(utils.colors.red("Error while hashing password:"), err);
        return;
      }
      // REGISTER USER
      utils.db.query(
        "INSERT INTO users (name, email, passwd) VALUES (?, ? ,?)",
        [data.name, data.email, hash]
      );
      res.status(200).json({
        status: "success",
        message: "REGISTER_OK",
      });
      console.log(
        utils.colors.blue(
          `[USER] New user: ${utils.colors.underline(data.name)}`
        )
      );
    });
  });
});

export default router;
