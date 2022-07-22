const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")

const auth = asyncHandler(async(req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1]

            //decode token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //adding user to the request
            req.user = await User.findById(decoded.id).select("-password")
            next()
        } catch (error) {
            res.status(401)
            throw new Error("Not authorized. token failed")
        }
    }else{
        res.status(401);
        throw new Error("Not authorized. token required");
    }
})

module.exports = auth