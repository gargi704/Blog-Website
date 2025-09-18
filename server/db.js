import mongoose from "mongoose";

const Connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error while connecting with database", error);
  }
};

export default Connection;
