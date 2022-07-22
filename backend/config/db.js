const mongoose = require("mongoose")

const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB)
        console.log(`Mongodb connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("Erron on connecting to database: "+error.message)
        process.exit()
    }
}

module.exports = connectDatabase