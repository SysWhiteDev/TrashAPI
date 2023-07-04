import { Request, Response, Router } from "express";
const addFriend: Router = Router();

import utils from "../../services/utils";

addFriend.post("/f", (req: Request, res: Response) => {
  // get target
  const target = req.query.target;
  if (!target) {
    res.status(404).json({
      status: "error",
      message: "NO_TARGET",
    });
    return;
  }

  // get requesting user
  const decodedUser = utils.jwt.decode(req.headers.auth as string) as {
    userid?: string;
  };
  if (decodedUser.userid == target) {
    res.status(500).json({
      status: "error",
      message: "INVALID_USER",
    });
    return;
  }

  // check if target exists
  utils.db.query("SELECT id FROM users WHERE id = ?", [target], (err, row) => {
    if (err) {
      res.status(500).json({
        status: "error",
        message: "UNK",
      });
      return;
    }
    if (row.length == 0) {
      res.status(404).json({
        status: "error",
        message: "NO_EXISTING_USER",
      });
      return;
    }

    // check if a friend relation already exists
    utils.db.query(
      "SELECT * FROM user_relations WHERE userid = ? AND type = 1",
      [decodedUser.userid],
      (err, row) => {
        if (err) {
          res.status(500).json({
            status: "error",
            message: "UNK",
          });
          return;
        }

        // relation types
        // * 1: friend
        // * 2: block

        if (row.length != 0) {
          // remove friend
          utils.db.query(
            "DELETE FROM user_relations WHERE userid = ? AND type = 1",
            [decodedUser.userid]
          );
          res.status(200).json({
            status: "success",
            message: "UN-FRIENDED",
          });
          return;
        }
        // add friend
        utils.db.query(
          "INSERT INTO user_relations (userid, targetid, type) VALUES (?, ?, 1)",
          [decodedUser.userid, target]
        );
        res.status(200).json({
          status: "success",
          message: "FRIENDED",
        });
        return;
      }
    );
  });
});

export default addFriend;
