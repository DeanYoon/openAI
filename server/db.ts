import mongoose from "mongoose";

// Connect to MongoDB using environment variable for the connection string
mongoose.connect("mongodb://127.0.0.1:27017/openai");
const db = mongoose.connection;
const chatDataSchema = new mongoose.Schema({
  myTextList: [
    {
      text: String,
      createdAt: String,
      updatedAt: String,
    },
  ],
  aiTextList: [
    {
      text: String,
      createdAt: String,
      updatedAt: String,
    },
  ],
});

const allChatDataSchema = new mongoose.Schema({
  sarcastic: chatDataSchema,
  lovely: chatDataSchema,
  exhausted: chatDataSchema,
  translation: chatDataSchema,
  dictionary: chatDataSchema,
});

const userSchema = new mongoose.Schema({
  id: Number,
  username: String,
  password: String,
  profileUrl: String,
  chatData: allChatDataSchema,
});

export const User = mongoose.model("User", userSchema);

const handleOpen = () => console.log("Connected to DB✅");
const handleError = (error: any) => console.log("DB Error", error);

db.on("error", handleError);
db.once("open", handleOpen);
