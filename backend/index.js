const express = require("express")
const dotenv = require('dotenv')
const envConfig = dotenv.config()
const cors = require("cors")
const connectDatabase = require("./config/db")
const {notFound, errorHandler} = require("./middlewares/errorHandleMiddleware")
const app = express()

//routes
const userRoutes = require("./routes/userRoutes")
const authRoutes = require("./routes/authRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")

if (envConfig.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

//connect database
connectDatabase()

app.use(express.json())
app.use(cors())

const rootRoute = "/api/v1"
app.use(rootRoute, userRoutes)
app.use(rootRoute, authRoutes)
app.use(rootRoute, chatRoutes)
app.use(rootRoute, messageRoutes);

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.SERVER_PORT || 5000
const server = app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:3000"
    } 
})

io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
        socket.join(userData._id)
        console.log("userData._id", userData._id);
        socket.emit("connected")
    })

    socket.on("joinchat", (room) => {
      socket.join(room);
      console.log("joinchat", room);
    });

    socket.on("newmessage", (newMessage) => {
        console.log("newMessage", newMessage);
        var chat = newMessage.chat
        if(!chat.users) return 

        chat.users.forEach(user => {
            if(user._id === newMessage.sender._id) return

            socket.in(user._id).emit("messagereceived", newMessage)
        });
    });

    socket.on("typing", (room) => {
      socket.in(room).emit("typing")
    });

    socket.on("stopTyping", (room) => {
      socket.in(room).emit("stopTyping");
    });

    socket.off("setup", () => {
      socket.leave(userData._id)
    });
})