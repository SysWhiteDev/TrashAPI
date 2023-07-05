import { Router } from "express";
const registerRecycleRoutes: Router = Router();

// material types
// - 0: paper
// - 1: plastic

import addRecycle from "./addRecycle";
registerRecycleRoutes.use(addRecycle);

export default registerRecycleRoutes;