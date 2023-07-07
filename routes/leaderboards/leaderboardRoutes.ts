import { Router } from "express";

const lbRoutes: Router = Router();

import lb from "./lb";
lbRoutes.use(lb);

export default lbRoutes;
