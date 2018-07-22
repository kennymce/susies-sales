import BaseCtrl from './base';
import News from '../models/news';

export default class NewsCtrl extends BaseCtrl {
  model = News;

  // Get all for given user
  getAllPublishedNews = (req, res) => {
    let rightNow = new Date(Date.now());
    this.model.find({publishDateTime: {$lt: rightNow}}, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  };
}
