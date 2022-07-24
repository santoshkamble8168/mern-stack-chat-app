const asyncHandler = require("express-async-handler")
const Chat = require("../models/chatModel")
const User = require("../models/userModel")

exports.getOneToOneChat = asyncHandler(async(req, res) => {
    const {userId} = req.body

    if (!userId) {
        res.status(400)
        throw new Error("UserId is not provided in the request")
    }

    //check chat is alredy exist
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("lastMessage");

    isChat = await User.populate(isChat, {
      path: "lastMessage.sender",
      select: "name email pic",
    });

    if (isChat.length > 0) {
        //if chat exist
        res.send(isChat[0])
    }else{
      //if chat not exist - create one
      let newChat = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId]
      }

      try {
        const createChat = await Chat.create(newChat)

        const FullChat = await Chat.findOne({_id: createChat._id}).populate("users", "-password")
        res.status(200).json({
          success: true,
          item: FullChat,
        });

      } catch (error) {
        res.status(400)
        throw new Error(error.message)
      }
    }

})

//get all chats for loggedin user
exports.getChats = asyncHandler(async(req, res) => {
    try {
        let chats = await Chat.find({
          users: { $elemMatch: { $eq: req.user._id } },
        })
          .populate("users", "-password")
          .populate("groupAdmin", "-password")
          .populate("lastMessage")
          .sort({ updatedAt : -1})
        
        chats = await User.populate(chats, {
          path: "lastMessage.sender",
          select: "name email pic",
        });

        res.status(200).json({
          success: true,
          item: chats,
        });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

exports.CreateGroupChat = asyncHandler(async(req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({
            success: false,
            message: "Please fill all the fields"
        })
    }

    //get all users from body
    const users = JSON.parse(req.body.users)
    if (users.length < 2) {
        return res.status(400).send({
          success: false,
          message: "More than 2 users are required to form a group",
        });
    }

    //add loggedin user in the group
    users.push(req.user._id)

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user._id
        })

        const FullChat = await Chat.findOne({ _id: groupChat._id })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");

        res.status(201).send({
          success: true,
          message: "New group created",
          item: FullChat,
        });

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

exports.renameGroupChat = asyncHandler(async(req, res) => {
    const {chatId, chatName} = req.body

    const updatedGroupName = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedGroupName) {
        res.status(400);
        throw new Error("Group not found!");
    }else{
        res.status(200).send({
          success: true,
          message: "Group name updated",
          item: updatedGroupName,
        });
    }

})

exports.addUserInGroupChat = asyncHandler(async(req, res) => {
    const { chatId, userId } = req.body;

    const updatedGroup = await Chat.findByIdAndUpdate(
      chatId,
      { $push: {users: userId} },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedGroup) {
      res.status(400);
      throw new Error("Group not found!");
    } else {
      res.status(200).send({
        success: true,
        message: "New user added",
        item: updatedGroup,
      });
    }
})

exports.removeUserFromGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const updatedGroup = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedGroup) {
    res.status(400);
    throw new Error("Group not found!");
  } else {
    res.status(200).send({
      success: true,
      message: "User removed from group",
      item: updatedGroup,
    });
  }
});