const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const generateToken = require("../utils/generateToken")

exports.loginUser = asyncHandler(async(req, res, next) => {
    const {email, password} = req.body

    if (!email || !password) {
        res.status(400)
        throw new Error("Please provide required fields")
    }

    //check user alredy exist
    const user = await User.findOne({ email: email })
    if (!user) {
        res.status(400)
        throw new Error("Invalid email or password")
    }

    const isPasswordMatched = await user.verifyPassword(password)
    if (!isPasswordMatched) {
        res.status(400)
        throw new Error("Invalid email or password")
    }

    const token = generateToken(user._id)
    res.status(201).json({
        success: true,
        item: user,
        token: token
    })

    
})