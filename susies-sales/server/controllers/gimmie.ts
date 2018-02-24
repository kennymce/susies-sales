import Post from '../models/post';
import BaseCtrl from './base';
import Gimmie from '../models/gimmie';

export default class GimmieCtrl extends BaseCtrl {
  model = Gimmie;

  // Get all for given user
  getAllGimmiesForUser = (req, res) => {
    this.model.find({ userId: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  };
}
