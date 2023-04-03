import express, { NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { IUser } from "./user";
import jwt from "jsonwebtoken";

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
  password: String,
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

//jwt middleware
const REACT_APP_JWT_SECRET = "afnndasjdnlawnd";
// Middleware to verify JWT token and extract user ID
const authMiddleware = (req: any, res: any, next: any) => {
  // Check for Authorization header
  const authHeader = req.headers;
  if (!authHeader) {
    return res.status(401).send("Missing Authorization header");
  }

  // Extract token from Authorization header
  const token = authHeader.split(" ")[1];

  // Verify the token and extract user ID
  try {
    const decodedToken: any = jwt.verify(token, REACT_APP_JWT_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};

// UserData getting API from Client

app.post("/users/:username", async (req, res) => {
  const username = req.params.username;
  const newData: IUser = req.body;
  try {
    const user = await User.findOneAndUpdate({ username }, newData, {
      upsert: true,
      new: true, // returns the updated document
    });
    console.log(user ? "Data updated" : "New data saved");

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && user.password === password) {
      res.status(200).send(user);
    } else if (!user) {
      res.status(500).send("User not exists");
    } else {
      res.status(500).send("Wrong Password");
    }

    // if (!user) {
    //   return res.status(401).send("Wrong Password");
    // }
    // const token = jwt.sign({ userId: user.id }, REACT_APP_JWT_SECRET, {
    //   expiresIn: "7d",
    // });
    // res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});
app.post("/signup", async (req, res) => {
  const { username } = req.body;
  const newData: IUser = req.body;

  try {
    const user = await User.exists({ username });
    if (user) {
      res.status(500).send("User Exists");
    } else if (!user) {
      const user = await User.findOneAndUpdate({ username }, newData, {
        upsert: true,
        new: true, // returns the updated document
      });
      res.status(200).send(user);
    }

    // if (!user) {
    //   return res.status(401).send("Wrong Password");
    // }
    // const token = jwt.sign({ userId: user.id }, REACT_APP_JWT_SECRET, {
    //   expiresIn: "7d",
    // });
    // res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
