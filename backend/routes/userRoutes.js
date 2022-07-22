const router = require("express").Router()
const { loginUser } = require("../controllers/authController")
const { registerUser, getAllUsers } = require("../controllers/userController")
const auth = require("../middlewares/authMiddleware")

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/user").get(auth, getAllUsers);

module.exports = router