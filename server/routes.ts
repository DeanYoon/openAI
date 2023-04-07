import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { IUser } from "./user.js";
import { User } from "./db.js";
import { authMiddleware } from "./authMiddleware.js";
import bcrypt from "bcryptjs";

const app = express();
const PORT = 4001;

app.use(cors());
app.use(bodyParser.json());

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
    const user = await User.findOne({ username: username });
    if (user) {
      if (password && user.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        isMatch
          ? res.status(200).send(user)
          : res.status(500).send("Wrong Password");
      }
    } else {
      res.status(500).send("User not exists");
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
