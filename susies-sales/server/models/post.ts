import * as mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  postId: String,
  description: String,
  from: String,
  size: Number,
  price: Number,
  photos: [{
    type: String
  }]
});

postSchema.pre('save', function (next) {
  // If the postId is 'new' it's a new record so replace the postId with an ObjectId
  var self = this;

  if (self.postId == 'new') {
    self.postId = mongoose.Types.ObjectId();
  }
  next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;
