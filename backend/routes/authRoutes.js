import Router from "express"
import { signIn, signOut, signUp } from "../controllers/authController.js"

const authRouter = Router()

authRouter.post("/signup", signUp)
authRouter.post("/signin", signIn)
authRouter.post("/logout", signOut)

export default authRouter