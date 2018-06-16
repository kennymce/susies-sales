import * as express from "express";

import PostCtrl from "./controllers/post";
import UserCtrl from "./controllers/user";
import GimmieCtrl from "./controllers/gimmie";
import PrivateMessageCtrl from "./controllers/privateMessage";
import NewsCtrl from "./controllers/news";
import * as jwt from "jsonwebtoken";

export default function setRoutes(app) {
  const router = express.Router();

  const postCtrl = new PostCtrl();
  const userCtrl = new UserCtrl();
  const gimmieCtrl = new GimmieCtrl();
  const newsCtrl = new NewsCtrl();
  const privateMessageCtrl = new PrivateMessageCtrl();
  const multer = require("multer");

  // Pictures
  const storage = multer.diskStorage({
    // multers disk storage settings
    destination: function(req, file, cb) {
      cb(null, __dirname + "/uploaded_/");
    },
    filename: function(req, file, cb) {
      const datetimestamp = Date.now();
      cb(null, file.originalname);
      // cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
  });
  const upload = multer({
    // multer settings
    storage: storage
  }).array("file");

  function requireAuthentication(req, res, next) {
    console.log("in requireAuthentication function for path: ", req.path);
    if (req.path == "/api/pictures" && req.method == "OPTIONS") {
      router.route("/pictures").options(function(req, res) {
        res.sendStatus(200);
      });
      next();
    } else {
      let token = req.headers["x-access-token"];
      if (!token)
        return res
          .status(401)
          .send({ auth: false, message: "No token provided." });
      jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
        if (err) {
          return res
            .status(500)
            .send({ auth: false, message: "Failed to authenticate token." });
        } else {
          console.log(`authenticated user`);
          next();
        }
      });
    }
  }

  /** API path to which images are uploaded */
  router.route("/pictures").post(function(req, res) {
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

  // No authentication for pictures GET since the HTTP request doesn't come from my APP
  router.route("/pictures/:name").get(function(req, res, next) {
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
  router.route("/Posts").get(requireAuthentication, postCtrl.getAll);
  router.route("/Posts/count").get(requireAuthentication, postCtrl.count);
  router.route("/Posts/user/:id").get(requireAuthentication, userCtrl.getAllPostsForUser);
  router.route("/Posts/unscheduled").get(requireAuthentication, postCtrl.getUnscheduledPosts);
  router.route("/Posts/schedule").post(requireAuthentication, postCtrl.schedulePosts);
  router.route("/post").post(requireAuthentication, postCtrl.insert);
  router.route("/post/:id").get(requireAuthentication, postCtrl.get);
  router.route("/post/:id").put(requireAuthentication, postCtrl.update);
  router.route("/post/:id").delete(requireAuthentication, postCtrl.delete);

  // Users
  router.route("/login").post(userCtrl.login);
  router.route("/users").get(requireAuthentication, userCtrl.getregisteredUsers);
  router.route("/users/count").get(requireAuthentication, userCtrl.count);
  router.route("/users/new").get(requireAuthentication, userCtrl.getUnregisteredUsers);
  router.route("/user").post(requireAuthentication, userCtrl.insert);
  router.route("/user/:id").get(requireAuthentication, userCtrl.get);
  router.route("/user/:id").put(requireAuthentication, userCtrl.update);
  router.route("/user/thisgirlsok/:id").put(requireAuthentication, userCtrl.authoriseUser);
  router.route("/user/:id").delete(requireAuthentication, userCtrl.delete);

  // Gimmies
  router.route("/gimmie").get(requireAuthentication, gimmieCtrl.getAll);
  router.route("/gimmie/count").get(requireAuthentication, gimmieCtrl.count);
  router.route("/gimmie").post(requireAuthentication, gimmieCtrl.insert);
  router.route("/gimmie/:id").get(requireAuthentication, gimmieCtrl.getAllGimmiesForUser);
  router.route("/gimmie/:id").put(requireAuthentication, gimmieCtrl.update);
  router.route("/gimmie/:id").delete(requireAuthentication, gimmieCtrl.delete);

  // News
  router.route("/news").get(requireAuthentication, newsCtrl.getAll);
  router.route("/news/count").get(requireAuthentication, newsCtrl.count);
  router.route("/news").post(requireAuthentication, newsCtrl.insert);
  router.route("/news/:id").put(requireAuthentication, newsCtrl.update);
  router.route("/news/:id").delete(requireAuthentication, newsCtrl.delete);

  // PrivateMessages
  router.route("/pm").get(requireAuthentication, privateMessageCtrl.getAll);
  router.route("/pm/count").get(requireAuthentication, privateMessageCtrl.count);
  router.route("/pm").post(requireAuthentication, privateMessageCtrl.insert);
  router.route("/pm/:id").get(requireAuthentication, privateMessageCtrl.getAllPrivateMessagesForUser);
  router.route("/pm/:id").put(requireAuthentication, privateMessageCtrl.update);
  router.route("/pm/:id").delete(requireAuthentication, privateMessageCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use("/api", router);
}
