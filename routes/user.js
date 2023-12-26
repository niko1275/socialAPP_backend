import express from "express";
const router = express.Router();

import { crearUsuario, signin, signup,perfil } from "../controllers/user.js";
import checkAuth from "../middleware/checkAuth.js";

router.post("/register",crearUsuario);
router.post("/signin", signin);
router.post("/signup", signup);
router.get('/perfil',checkAuth,perfil);

export default router;