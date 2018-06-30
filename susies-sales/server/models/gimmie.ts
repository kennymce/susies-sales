import * as mongoose from 'mongoose';

const gimmieSchema = new mongoose.Schema({
  gimmieId: String,
  userId: String,
  Post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
  dateTimeRequested:  { type : Date, default: Date.now },
  read: { type: String, default: 'n'}
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
