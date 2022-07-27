const router = require("express").Router()
const { sendMessage, getAllMessages } = require("../controllers/messageController");
const Auth = require("../middlewares/authMiddleware")

router.route("/message").post(Auth, sendMessage)
router.route("/message/:chatId").get(Auth, getAllMessages);

module.exports = router