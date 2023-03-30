// server.ts
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
const db = mongoose.connection;
const app = express();
const PORT = 4000;

app.use(bodyParser.json());

// Connect to MongoDB (replace `your_mongodb_connection_string` with your actual connection string)
mongoose.connect("mongodb://127.0.0.1:27017/openai");
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
  profileUrl: String,
  chatData: allChatDataSchema,
});

const User = mongoose.model("User", userSchema);

const handleOpen = () => console.log("Connected to DB");
const handleError = (error: any) => console.log("DB Error", error);

db.on("error", handleError);
db.once("open", handleOpen);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const getData = async (id: number) => {
  const videos = await User.findOne({ id: id });

  return videos;
};

const newUser = new User({
  id: 123,
  username: "johnasdasdasdjhkabshjd.doe",
  profileUrl: "https:ple.com/profile.jpg",
  chatData: {
    sarcastic: {
      myTextList: [
        {
          text: "Hello world!",
          createdAt: "2022-04-01",
          updatedAt: "2022-04-01",
        },
      ],
      aiTextList: [],
    },
    lovely: {
      myTextList: [
        {
          text: "How are you today?",
          createdAt: "2022-04-01",
          updatedAt: "2022-04-01",
        },
      ],
      aiTextList: [],
    },
    exhausted: {
      myTextList: [],
      aiTextList: [],
    },
    translation: {
      myTextList: [],
      aiTextList: [],
    },
    dictionary: {
      myTextList: [],
      aiTextList: [],
    },
  },
});

async function fetchData(id: number) {
  const data = await getData(id);
  if (data) {
    await User.findOneAndDelete({ id: id });
    console.log("found data and deleted");
  } else {
    await newUser.save();
    console.log("data saved");
  }
}

fetchData(123);
