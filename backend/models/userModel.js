const mongoose = require("mongoose")
const bcryptJs = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
}, {timestamps: true})

userSchema.pre("save", async function(next){
    if (!this.isModified("password")) { //check is incomming request is not a password change request
        next() //if its not then return the next
    }

    //if its a password chnage request do this
    this.password = await bcryptJs.hash(this.password, 10) 
})

//verify password
userSchema.methods.verifyPassword = async function(inputPassword){
    return await bcryptJs.compare(inputPassword, this.password)
}


const User = mongoose.model("User", userSchema)
module.exports = User