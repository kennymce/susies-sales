import Post from '../models/post';
import Gimmie from '../models/gimmie';
import BaseCtrl from './base';

export default class PostCtrl extends BaseCtrl {
  model = Post;
  gimmie = Gimmie;

  schedulePosts = (req, res) => {
    console.log('Scheduling posts for date: ', req.query.scheduleDateTime);
    let scheduleDateTime = req.query.scheduleDateTime;
    this.updateManyById(req, res, req.body, scheduleDateTime, 'scheduleDateTime');
  };

  updateManyById = (req, res, _ids, value, field) => {
    // TODO make this generic by building the conditions and update using value and field parameters
    let conditions = {postId: {$in: _ids}}
      , update = {$set: {'dateTimePublish': value}}
      , options = {multi: true, status: true};
    let utcDate = new Date(value);

    this.model.update(conditions, update, options, callback);

    function callback(err, numAffected) {
      if (err) {
        return console.error(err);
      }
      {
        console.log('number affected: ', numAffected);
        res.sendStatus(200);
      }
    }
  };

  getUnscheduledPosts = (req, res) => {
    console.log(`in getUnscheduledPosts`);
    this.model.find({ dateTimePublish: null }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  };

  //TODO cascade delete the gimmies when a post is deleted
}
