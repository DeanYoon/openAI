import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();
const PORT = 4001;

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
  profileUrl: String,
  chatData: allChatDataSchema,
});

const User = mongoose.model("User", userSchema);

const handleOpen = () => console.log("Connected to DB✅");
const handleError = (error: any) => console.log("DB Error", error);

db.on("error", handleError);
db.once("open", handleOpen);

app.use(cors());
app.use(bodyParser.json());

// UserData getting API from Client
app.post("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  const newData = req.body;
  console.log("from client", newData);
  try {
    const user = await User.findOneAndUpdate({ id: userId }, newData, {
      upsert: true,
    });
    console.log(user ? "Data updated" : "New data saved");
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
