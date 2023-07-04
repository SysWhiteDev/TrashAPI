import { Router } from "express";
const userRoutes: Router = Router();

import getUser from "./getUser";
import addFriend from "./addFriend";

userRoutes.use(getUser);
userRoutes.use(addFriend);

export default userRoutes
