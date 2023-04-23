import mongoose from "mongoose";

export type IComment = {
  id: number;
  title: string;
  content: string;
  username: string;
  upvote: number;
};

const commentSchema = new mongoose.Schema({
  id: Number,
  title: String,
  content: String,
  username: String,
  upvote: Number,
});

export const Comment = mongoose.model("Comment", commentSchema);
