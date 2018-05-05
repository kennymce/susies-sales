import BaseCtrl from './base';
import PrivateMessage from '../models/privateMessage';

export default class PrivateMessageCtrl extends BaseCtrl {
  model = PrivateMessage;

  // Get all for given user
  getAllPrivateMessagesForUser = (req, res) => {
    this.model.find({ toUser: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  };
}
