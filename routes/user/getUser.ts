import express, { Request, Response, Router } from "express";
const getUser: Router = Router();

import utils from "../../services/utils";

const friendPossibleValues = {
  "00": "FALSE",
  "10": "PENDING",
  "01": "REQUESTED",
  "11": "TRUE",
};

getUser.get("/:id", (req: Request, res: Response) => {
  const scope = req.query.scope;
  const id = req.params.id;
  if (!scope || scope == "user") {
    // get user data
    utils.db.query(
      "SELECT id, name, badges, perms, rdate FROM users WHERE id = ?",
      [id],
      (err, row) => {
        if (row.length === 0) {
          res.status(404).json({
            status: "error",
            message: "USER_NOTFOUND",
          });
          return;
        }

        // get stats
        utils.db.query(
          "SELECT userid, qta, type FROM user_recycles WHERE userid = ?",
          [id],
          (err, stats) => {
            if (err) {
              res.status(500).json({
                status: "error",
                message: "UNK",
              });
              return;
            }
            const statsObj = {
              unit: "g",
              paper: {
                value: 0,
                co2value: 0,
              },
              plastic: {
                value: 0,
                co2value: 0,
              },
            };

            for (const stat of stats) {
              // calculate total of type 0 (paper)
              if (stat.type == 0) {
                statsObj.paper.value += stat.qta;
              } else if (stat.type == 1) {
                statsObj.plastic.value += stat.qta;
              }
            }

            // calculate c02values
            const paperMultiplier = Number(process.env.PAPER_MULTIPLIER);
            const plasticMultiplier = Number(process.env.PLASTIC_MULTIPLIER);

            statsObj.paper.co2value = statsObj.paper.value * paperMultiplier;
            statsObj.plastic.co2value = statsObj.plastic.value * plasticMultiplier;

            // get friend data
            const decodedUser = utils.jwt.decode(
              req.headers.auth as string
            ) as {
              userid?: string;
            };

            const userid = decodedUser.userid;
            const targetid = id;

            let uservalue = 0;
            let targetvalue = 0;

            // get user value
            utils.db.query(
              "SELECT * FROM user_relations WHERE userid = ? AND type = 1",
              [userid],
              (err, userdata) => {
                if (err) {
                  res.status(500).json({
                    status: "error",
                    message: "UNK",
                  });
                  return;
                }
                if (userdata.length != 0) {
                  uservalue = 1;
                }
                // get target value
                utils.db.query(
                  "SELECT * FROM user_relations WHERE userid = ? AND type = 1",
                  [targetid],
                  (err, userdata) => {
                    if (err) {
                      res.status(500).json({
                        status: "error",
                        message: "UNK",
                      });
                      return;
                    }
                    if (userdata.length != 0) {
                      targetvalue = 1;
                    }

                    // give response
                    res.status(200).json({
                      ...row[0],
                      stats: statsObj,
                      friend:
                        friendPossibleValues[
                          `${uservalue}${targetvalue}` as keyof typeof friendPossibleValues
                        ],
                    });
                    return;
                  }
                );
              }
            );
          }
        );
      }
    );
  }
});

export default getUser;
