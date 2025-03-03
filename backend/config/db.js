import mongoose from 'mongoose'
import { configDotenv } from 'dotenv'
configDotenv()

export const connectToDb = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb connected successfully")
    }catch(error){
        console.error(`error connecting to database: ${error}`)
        process.exit(1)
    }
}