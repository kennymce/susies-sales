import * as mongoose from 'mongoose';

const privateMessageSchema = new mongoose.Schema({
  privateMessageId: String,
  userId: String,
  postId: String,
  message: String,
  dateTimeOfMessage:  { type : Date, default: Date.now }
});

privateMessageSchema.pre('save', function (next) {
  // If the privateMessageId is 'new' it's a new record so replace the privateMessageId with an ObjectId
  console.log('in privateMessage pre-save');
  let self = this;

  if (self.privateMessageId == 'new') {
    let privateMessageId = mongoose.Types.ObjectId();
    self.privateMessageId = privateMessageId;
    self._id = privateMessageId;
  }
  next();
});

const PrivateMessage = mongoose.model('PrivateMessage', privateMessageSchema);

export default PrivateMessage;
