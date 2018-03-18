import Post from '../models/post';
import BaseCtrl from './base';

export default class PostCtrl extends BaseCtrl {
  model = Post;

  schedulePosts = (req, res) => {
    console.log(req.body);

/*
    this.model.find({ userId: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
    */
  };
}
