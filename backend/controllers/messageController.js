const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

exports.sendMessage = asyncHandler(async(req, res) => {
   const { content, chatId } = req.body
   
   if (!content || !chatId) {
    res.status(400);
    throw new Error("Content and chatId required");
   }

   const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId
   }

   try {
    let message = await Message.create(newMessage)
    message = await message.populate("sender", "name pic")
    message = await message.populate("chat")
    message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email"
    })

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message
    });

    res.status(200).json({
      success: true,
      item: message,
    });

   } catch (error) {
    res.status(400);
    throw new Error(error.message);
   }
})

exports.getAllMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email pic")
      .populate("chat");

    res.status(200).json({
      success: true,
      item: messages,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});