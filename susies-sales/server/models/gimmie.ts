import * as mongoose from 'mongoose';
import DateTimeFormat = Intl.DateTimeFormat;

const gimmieSchema = new mongoose.Schema({
  gimmieId: String,
  userId: String,
  postId: String,
  dateTimeRequested:  { type : Date, default: Date.now }
});

gimmieSchema.pre('save', function (next) {
  // If the gimmieId is 'new' it's a new record so replace the gimmieId with an ObjectId
  console.log('in gimmie pre-save');
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
