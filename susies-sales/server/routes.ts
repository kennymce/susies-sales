import * as express from "express";

import PostCtrl from "./controllers/post";
import UserCtrl from "./controllers/user";
import GimmieCtrl from "./controllers/gimmie";
import PrivateMessageCtrl from "./controllers/privateMessage";
import NewsCtrl from "./controllers/news";
import User from "./models/user";
export default function setRoutes(app) {

  const router = express.Router();

  const postCtrl = new PostCtrl();
  const userCtrl = new UserCtrl();
  const gimmieCtrl = new GimmieCtrl();
  const newsCtrl = new NewsCtrl();
  const privateMessageCtrl = new PrivateMessageCtrl();
  const multer = require("multer");

  // Pictures
  const storage = multer.diskStorage({ // multers disk storage settings
    destination: function(req, file, cb) {
      cb(null, __dirname + "/uploaded_/");
    },
    filename: function(req, file, cb) {
      const datetimestamp = Date.now();
      cb(null, file.originalname);
      // cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
  });
  const upload = multer({ // multer settings
    storage: storage
  }).array("file");

  /** API path that will upload the files */
  router.route("/pictures")
    .post(function(req, res) {
      console.log("in router.route for POST /pictures/");
      upload(req, res, function(err) {
        if (err) {
          console.log("error in upload: " + err);
          res.json({ error_code: 1, err_desc: err });
          return;
        }
        res.json({ error_code: 0, err_desc: null });
      });
    });
  router.route("/pictures/:name")
    .get(function(req, res, next) {
      let options = {
        root: __dirname + "/uploaded_/",
        dotfiles: "deny",
        headers: {
          "x-timestamp": Date.now(),
          "x-sent": true
        }
      };
      let fileName = req.params.name;
      res.sendFile(fileName, options, function(err) {
        if (err) {
          next(err);
        } else {
          console.log("Sent:", fileName);
        }
      });
    });

  // Posts
router.route("/Posts").get(postCtrl.getAll);
router.route("/Posts/count").get(postCtrl.count);
router.route("/Posts/user/:id").get(userCtrl.getAllPostsForUser);
router.route("/Posts/unscheduled").get(postCtrl.getUnscheduledPosts);
router.route("/Posts/schedule").post(postCtrl.schedulePosts);
router.route("/post").post(postCtrl.insert);
router.route("/post/:id").get(postCtrl.get);
router.route("/post/:id").put(postCtrl.update);
router.route("/post/:id").delete(postCtrl.delete);

// Users
router.route("/login").post(userCtrl.login);
router.route("/users").get(userCtrl.getregisteredUsers);
router.route("/users/count").get(userCtrl.count);
router.route("/users/new").get(userCtrl.getUnregisteredUsers);
router.route("/user").post(userCtrl.insert);
router.route("/user/:id").get(userCtrl.authenticatedGet); // was get
router.route("/user/:id").put(userCtrl.update);
router.route("/user/thisgirlsok/:id").put(userCtrl.authoriseUser);
router.route("/user/:id").delete(userCtrl.delete);
router.route("/userauth").get(userCtrl.authenticateUserToken);

// Gimmies
router.route("/gimmie").get(gimmieCtrl.getAll);
router.route("/gimmie/count").get(gimmieCtrl.count);
router.route("/gimmie").post(gimmieCtrl.insert);
router.route("/gimmie/:id").get(gimmieCtrl.getAllGimmiesForUser);
router.route("/gimmie/:id").put(gimmieCtrl.update);
router.route("/gimmie/:id").delete(gimmieCtrl.delete);

// News
router.route("/news").get(newsCtrl.getAll);
router.route("/news/count").get(newsCtrl.count);
router.route("/news").post(newsCtrl.insert);
router.route("/news/:id").put(newsCtrl.update);
router.route("/news/:id").delete(newsCtrl.delete);

// PrivateMessages
router.route("/pm").get(privateMessageCtrl.getAll);
router.route("/pm/count").get(privateMessageCtrl.count);
router.route("/pm").post(privateMessageCtrl.insert);
router.route("/pm/:id").get(privateMessageCtrl.getAllPrivateMessagesForUser);
router.route("/pm/:id").put(privateMessageCtrl.update);
router.route("/pm/:id").delete(privateMessageCtrl.delete);

// Apply the routes to our application with the prefix /api
app.use("/api", router);

}
