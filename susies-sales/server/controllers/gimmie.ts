import BaseCtrl from "./base";
import Gimmie from "../models/gimmie";
import Post from "../models/post";

export default class GimmieCtrl extends BaseCtrl {
  model = Gimmie;

  // Get all for given user
  getAllGimmiesForUser = (req, res) => {
    this.model
      .find({ userId: req.params.id })
      .populate("Post")
      .exec(function(err, gimmies) {
      if (err) {
        return console.error(err);
      }
      console.log("gimmies: ", gimmies);
      res.status(200).json(gimmies);
    });
  };

  // Insert
  insert = (req, res) => {
    const obj = new this.model(req.body);
    obj.Post = req.body.postId;
    console.log("in insert method in controllers  gimmie.ts");
    obj.save((err, item) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
      res.status(200).json(item);
    });
  };

  // Get all gimmies for Gimmies screen: join with Posts
  getAllGimmies = (req, res) => {
    this.model
      .find({})
      .populate("Post")
      .exec(function(err, gimmies) {
        if (err) {
          return console.error(err);
        }
        console.log("gimmies: ", gimmies);
        res.status(200).json(gimmies);
      });
  };
}
