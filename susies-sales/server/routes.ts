import * as express from 'express';

import PostCtrl from './controllers/post';
import UserCtrl from './controllers/user';
import Post from './models/post';
import User from './models/user';

export default function setRoutes(app) {

  const router = express.Router();

  const postCtrl = new PostCtrl();
  const userCtrl = new UserCtrl();
  const multer = require('multer');

  // Pictures
  const storage = multer.diskStorage({ // multers disk storage settings
    destination: function (req, file, cb) {
      cb(null, './uploaded_');
    },
    filename: function (req, file, cb) {
      const datetimestamp = Date.now();
      cb(null, file.originalname);
      // cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
  });
  const upload = multer({ // multer settings
    storage: storage
  }).array('file');

  /** API path that will upload the files */
  router.route('/pictures')
    .post(function(req, res) {
    console.log('in router.route for /pictures....');
    upload(req, res, function (err){
      if ( err ) {
        console.log('error in upload: ' + err);
        res.json({error_code: 1, err_desc : err});
        return;
      }
      res.json({error_code: 0, err_desc : null});
    });
  });

  // Posts
  router.route('/Posts').get(postCtrl.getAll);
  router.route('/Posts/count').get(postCtrl.count);
  router.route('/post').post(postCtrl.insert);
  router.route('/post/:id').get(postCtrl.get);
  router.route('/post/:id').put(postCtrl.update);
  router.route('/post/:id').delete(postCtrl.delete);

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
