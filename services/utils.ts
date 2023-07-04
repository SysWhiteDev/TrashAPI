// useful modules
import colors from "colors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// db connector
import db from "./db";

// AuthMid
import authMid from "../auth/authMiddleware";

const utils = {
  colors,
  db,
  bcrypt,
  jwt,
  authMid,
};

export default utils;
