const express = require("express")
const router = express.Router()

const { signup, signin, signout, getallusers, getUserById } = require("../controllers/userController");
const { verifyToken, verifyRefreshToken, generateAccessToken, isAdmin } = require("../middlewares/auth");
const expressValidator = require("../middlewares/expressValidator");
const { signupValidator, signinValidator } = require("../validators/userValidator");

router.post("/signup", signupValidator, expressValidator, signup);

router.post("/signin", signinValidator, expressValidator, signin);

router.post("/token", verifyRefreshToken, generateAccessToken)

router.get("/signout", verifyToken, signout);

router.get("/getallusers", verifyToken, isAdmin, getallusers);

router.get("/getUserById/:userId", verifyToken, getUserById);

module.exports = router