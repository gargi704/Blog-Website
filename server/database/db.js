import mongoose from "mongoose";

const Connection = async (username, password) => {
  const URL = `mongodb://${username}:${password}@ac-nbnjcje-shard-00-00.syj4bcj.mongodb.net:27017,ac-nbnjcje-shard-00-01.syj4bcj.mongodb.net:27017,ac-nbnjcje-shard-00-02.syj4bcj.mongodb.net:27017/?ssl=true&replicaSet=atlas-13q67f-shard-0&authSource=admin&retryWrites=true&w=majority&appName=blog-app`;
  try {
    await mongoose.connect(URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error while connecting with the database", error);
  }
};

export default Connection;
