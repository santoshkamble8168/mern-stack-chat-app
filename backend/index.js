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

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.SERVER_PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})