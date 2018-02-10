import * as mongoose from 'mongoose';

const gimmieSchema = new mongoose.Schema({
  gimmieId: String,
  username: String,
  postId: String
});

gimmieSchema.pre('save', function (next) {
  // If the gimmieId is 'new' it's a new record so replace the gimmieId with an ObjectId
  let self = this;

  if (self.gimmieId == 'new') {
    let gimmieId = mongoose.Types.ObjectId();
    self.gimmieId = gimmieId;
    self._id = gimmieId;
  }
  next();
});

const Gimmie = mongoose.model('Gimmie', gimmieSchema);

export default Gimmie;
