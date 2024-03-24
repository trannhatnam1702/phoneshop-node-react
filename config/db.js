import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to MongoDb!`.bgGreen.black);
    } catch (error) {
        console.log(`Fail to connect MongoDb: ${error}`.bgRed.white);
    }
}

export default connectDB;
