const router = require("express").Router()
const {
  getOneToOneChat,
  getChats,
  CreateGroupChat,
  renameGroupChat,
  addUserInGroupChat,
  removeUserFromGroupChat,
} = require("../controllers/chatController");
const Auth = require("../middlewares/authMiddleware")

router.route("/chat").post(Auth, getOneToOneChat)
router.route("/chat").get(Auth, getChats)

router.route("/chat/group").post(Auth, CreateGroupChat);
router.route("/chat/group/rename").put(Auth, renameGroupChat)
router.route("/chat/group/adduser").put(Auth, addUserInGroupChat)
router.route("/chat/group/removeuser").put(Auth, removeUserFromGroupChat)

module.exports = router