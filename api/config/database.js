const mongoose = require('mongoose')
require('dotenv').config()

const connectDatabase = async()=>{
    try{
        const data = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connection established on", data.connection.host)
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectDatabase;