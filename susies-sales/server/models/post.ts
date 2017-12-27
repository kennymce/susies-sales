import * as mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  description: String,
  from: String,
  size: Number,
  price: Number,
  photo: String
});

const Post = mongoose.model('Post', postSchema);

export default Post;