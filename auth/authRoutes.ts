import { Router } from "express";
import RegistrationRoutes from "./registration";
import LoginRoutes from "./login";

const authRoutes: Router = Router();

authRoutes.use(RegistrationRoutes);
authRoutes.use(LoginRoutes);

export default authRoutes;
