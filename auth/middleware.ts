import express, { Request, Response, NextFunction } from "express";
import utils from "../services/utils";

const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.auth;
  if (!token) {
    res.status(401).json({
      status: "error",
      message: "NO_TOKEN",
    });
  }

  utils.jwt.verify(
    token as string,
    process.env.J_SIGNKEY as string,
    (err, result) => {
      if (err) {
        res.status(500).json({
          status: "error",
          message: "AUTH_FAILED",
        });
        return;
      }

      utils.db.query(
        "SELECT active FROM tokens WHERE token = ?",
        [token],
        (err, row) => {
          if (err) {
            res.status(500).json({
              status: "error",
              message: "UNK",
            });
            return;
          }
          if (!row) {
            res.status(500).json({
              status: "error",
              message: "AUTH_FAILED",
            });
            return;
          }
          if (row[0].active === 1) {
            next();
          } else {
            res.status(500).json({
              status: "error",
              message: "AUTH_FAILED",
            });
            return;
          }
        }
      );
    }
  );
};

export default AuthMiddleware;
