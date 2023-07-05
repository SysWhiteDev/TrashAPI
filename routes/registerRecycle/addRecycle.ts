import { Router, Request, Response } from "express";
const addRecycle: Router = Router();

import utils from "../../services/utils";

addRecycle.post("/", (req: Request, res: Response) => {
  if (!req.body.value || !req.body.type) {
    res.status(404).json({
      status: "error",
      message: "MISSING_INFO",
    });
    return;
  }
  // get user id
  const decodedUser = utils.jwt.decode(req.headers.auth as string) as {
    userid?: string;
  };
  const userId = decodedUser.userid;

  utils.db.query(
    "INSERT INTO user_recycles (userid, qta, type, rdate) VALUES (?, ?, ?, UNIX_TIMESTAMP())",
    [userId, req.body.value, req.body.type],
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
        message: "ADDED"
      })
    }
  );
});

export default addRecycle;
