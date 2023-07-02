import express, { Router } from "express";
const router: Router = express.Router();

import utils from "../services/utils";

router.post("/l", (req, res) => {
  const data = req.body;
  //   Check if data is correct
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
  }
  // Check if user exists
  utils.db.query(
    "SELECT name, passwd, id, perms, rdate FROM users WHERE name = ?",
    [data.name],
    (err, row) => {
      if (err) {
        res.status(500).json({
          status: "error",
          message: "UNK",
        });
        return;
      }
      if (row.length === 0) {
        res.status(500).json({
          status: "error",
          message: "AUTH_FAILED",
        });
        return;
      }
      // Check if password is correct
      utils.bcrypt.compare(data.passwd, row[0].passwd, (error, result) => {
        if (error) {
          res.status(500).json({
            status: "error",
            message: "UNK",
          });
          return;
        }
        if (!result) {
          res.status(500).json({
            status: "error",
            message: "AUTH_FAILED",
          });
          return;
        }
        // Give token
        const token = utils.jwt.sign(
          {
            userid: row[0].id,
            username: row[0].name,
            perms: row[0].perms,
            rdate: row[0].rdate,
          },
          process.env.J_SIGNKEY as string
        );
        utils.db.query(
          "INSERT INTO tokens (token, active) VALUES (?, 1)",
          [token],
          (err, row) => {
            if (err) {
              res.status(500).json({
                status: "error",
                message: "UNK",
              });
              return;
            }
            res.status(200).json({
              status: "success",
              message: "AUTH_OK",
              token: token,
            });
          }
        );
      });
    }
  );
});

export default router;
