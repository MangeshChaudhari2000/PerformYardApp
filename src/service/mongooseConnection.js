import mongoose from "mongoose";



const mongooseConnection = async () =>
    await mongoose.connect(process.env.DB_URL)
        .then(() => console.log('Connected to MongoDB !'));

export default mongooseConnection;