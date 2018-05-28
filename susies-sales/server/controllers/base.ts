abstract class BaseCtrl {

  abstract model: any;

  // Get all
  getAll = (req, res) => {
    console.log('in get all');
    this.model.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      res.status(200).json(docs);
    });
  };

  // Count all
  count = (req, res) => {
    console.log('in count all');
    this.model.count((err, count) => {
      if (err) { return console.error(err); }
      res.status(200).json(count);
    });
  };

  // Insert
  insert = (req, res) => {
    const obj = new this.model(req.body);

    console.log('in insert method in base.ts');
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

  // Get by id
  get = (req, res) => {
    console.log(`in get by id: ${req.params.id}`);
    this.model.findOne({ _id: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  };

  // Update by id
  update = (req, res) => {
    console.log('body in update function: ' + JSON.stringify(req.body));
    this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
      if (err) { return console.error(err); }
      {
        res.sendStatus(200);
      }
    });
  };

  // Delete by id
  delete = (req, res) => {
    console.log(`deleting by Id: ${req.params.id}`);
    this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }
}

export default BaseCtrl;
