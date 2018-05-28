import * as jwt from "jsonwebtoken";
import User from "../models/user";
import BaseCtrl from "./base";

export default class UserCtrl extends BaseCtrl {
  model = User;

  login = (req, res) => {
    this.model.findOne({email: req.body.email, approved: 'y'}, (err, user) => {
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

  authenticateUserToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) return res.status(401).send({ auth: false, message: "No token provided." });
    jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: "Failed to authenticate token." });

      console.log("finding user by id", decoded.user._id);
      User.findOne({ _id: decoded.user._id }, (err, user) => {
        if (!user) {
          return res.status(403).send("could not find user");
        } else {
          return res.status(200).send("found user");
        }
      });
    });
  };

  // Get by id authenticated with token
  authenticatedGet = (req, res) => {
    let token = req.headers["x-access-token"];
    if (!token) return res.status(401).send({ auth: false, message: "No token provided." });
    jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: "Failed to authenticate token." });

      console.log("finding user by id", decoded.user._id);
      User.findOne({ _id: req.params.id }, (err, item) => {
        if (err) { return console.error(err); }
        res.status(200).json(item);
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
