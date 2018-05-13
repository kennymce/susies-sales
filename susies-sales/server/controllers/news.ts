import BaseCtrl from './base';
import News from '../models/news';

export default class NewsCtrl extends BaseCtrl {
  model = News;

  // Get all for given user
  getAllNewsTimeWindow = (req, res) => {
    // TODO implement BETWEEN AND in here
    this.model.find({ dateTimePublish: req.params.since }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  };
}
