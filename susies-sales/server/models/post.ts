import * as mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  postId: String,
  description: String,
  from: String,
  size: Number,
  price: Number,
  photos: [{
    type: String
  }],
  dateTimePublish:  { type : Date }
});

postSchema.pre('save', function (next) {
  // If the postId is 'new' it's a new record so replace the postId with an ObjectId
  let self = this;

  if (self.postId == 'new') {
    let postId = mongoose.Types.ObjectId();
    self.postId = postId;
    self._id = postId;
  }
  next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;
