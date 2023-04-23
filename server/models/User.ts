import mongoose from "mongoose";

export type IUser = {
  id: number;
  username: string;
  profileUrl: string;
  chatData: {
    [key: string]: {
      myTextList: Array<{
        text: string;
        createdAt: string;
        updatedAt: string;
      }>;
      aiTextList: Array<{
        text: string;
        createdAt: string;
        updatedAt: string;
      }>;
    };
  };
};

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
