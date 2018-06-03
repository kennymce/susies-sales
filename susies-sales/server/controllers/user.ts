import * as jwt from "jsonwebtoken";
import User from "../models/user";
import BaseCtrl from "./base";

export default class UserCtrl extends BaseCtrl {
  model = User;

  login = (req, res) => {
    this.model.findOne({email: req.body.email, approved: 'y'}, (err, user) => {
      console.log('in users.login');
      if (!user) {
        return res.sendStatus(403);
      }
      user.comparePassword(req.body.password, (error, isMatch) => {
        if (!isMatch) {
          return res.sendStatus(403);
        }
        const token = jwt.sign({user: user}, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
        res.status(200).json({token: token});
      });
    });
  };

  findByEmail = (email) => {
    this.model.findOne({email: email}, (err, item) => {
      if (err) {
        return console.error(err);
      }
      return item;
    });
  };

  // Get all for given user
  getAllPostsForUser = (req, res) => {
    this.model
      .findOne({userId: req.params.id})
      .populate("user", "gimmie")
      .exec(
        function (err, user) {
          if (err) return console.error(err);

          console.log("The gimmies are", user.gimmies.postId);
        },
        (err, item) => {
          if (err) {
            return console.error(err);
          }
          res.status(200).json(item);
        }
      );
  };

  // Get all new users requiring authorised by admin
  getUnregisteredUsers = (req, res) => {
    this.model.find({approved: "n"}, (err, item) => {
      if (err) {
        return console.error(err);
      }
      res.status(200).json(item);
    });
  };

  // Get all new users requiring authorised by admin
  getregisteredUsers = (req, res) => {
    this.model.find({approved: "y"}, (err, item) => {
      if (err) {
        return console.error(err);
      }
      res.status(200).json(item);
    });
  };

  // Authorise this user
  authoriseUser = (req, res) => {
    let conditions = {_id: req.params.id}
      , update = {$set: {approved: 'y'}}
      , options = {multi: false};

    this.model.update(conditions, update, options, callback);

    function callback(err, numAffected) {
      if (err) {
        return console.error(err);
      }
      res.status(200).json(numAffected);
    }
  };
}
