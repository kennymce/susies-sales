import * as mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  name: String,
  weight: Number,
  age: Number
});

const Post = mongoose.model('Post', postSchema);

export default Post;
