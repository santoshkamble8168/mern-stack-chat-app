const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const generateToken = require("../utils/generateToken")

exports.registerUser = asyncHandler(async(req, res, next) => {
    const {name, email, password, pic} = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please provide required fields")
    }

    //check user alredy exist
    const user = await User.findOne({email: email})

    if (user) {
        res.status(400)
        throw new Error("User alredy exist")
    }

    const newUser = await User.create({
        name,
        email,
        password,
        pic
    })

    if (newUser) {
        const token = generateToken(newUser._id)
        res.status(201).json({
            success: true,
            message: "User created successfully",
            item: newUser,
            token: token
        })
    }else{
        res.status(400)
        throw new Error("Field to create new user")
    }
})

// /user?search=search_term
exports.getAllUsers = asyncHandler(async(req, res, next) => {
    const keyword = req.query.search ? {
        $or: [
            {name: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}}
        ]
    } : {}

    const users = await User.find(keyword).find({_id: {$ne: req.user._id}})
    res.status(200).json({
      success: true,
      items: users,
    });
})