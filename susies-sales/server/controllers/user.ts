import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import User from '../models/user';
import BaseCtrl from './base';

export default class UserCtrl extends BaseCtrl {
  model = User;

  login = (req, res) => {
    this.model.findOne({ email: req.body.email }, (err, user) => {
      if (!user) { return res.sendStatus(403); }
      user.comparePassword(req.body.password, (error, isMatch) => {
        if (!isMatch) { return res.sendStatus(403); }
        const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
        res.status(200).json({ token: token });
      });
    });
  };

  // Get all for given user
  getAllPostsForUser = (req, res) => {
    this.model.findOne({ userId: req.params.id })
      .populate('user','gimmie')
      .exec(function (err, user) {
        if (err) return console.error(err);

        console.log('The gimmies are',user.gimmies.postId);
    }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  };
}
