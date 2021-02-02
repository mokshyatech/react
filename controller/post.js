const { validationResult } = require("express-validator");

const thread = require("./helper/post");

// all user cam add thread
// name
// image
// date brought
// date
// fault description
// description
exports.addThread = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    // const { name,image,faultDescription,ca}
    const name = req.body.name;

    const imageUrl = req.body.image;
    const dateBought = req.body.dateBought;
    const faultDescription = req.body.faultDescription;
    const description = req.body.description;
    const userId = req.user._id;
    const category = req.body.category;
    thread.createThread(
      {
        name,
        imageUrl,
        faultDescription,
        description,
        dateBought,
        category,
        user: userId,
      },
      (err, thread) => {
        if (!err) {
          res.json({ success: thread });
        } else {
          res.json({ err: err });
        }
      }
    );
  } else {
    res.status(400).json(errors);
  }
};
exports.updateThread = (req, res) => {
  thread.updateThread(
    {
      admin: req.user.role.toLowerCase() == "admin" ? true : false,
      threadId: req.params.id,
      name: req.body.name,
      image: req.body.image,
      faultDescription: req.body.faultDescription,
      description: req.body.description,
      userId: req.user._id,
      dateBought: req.body.dateBought,
      hide: req.body.hide,
    },
    (err, data) => {
      if (err && err == "UnAuthorize") {
        res.status(400).json({ err: "Unauthorized access" });
        return;
      }
      if (err && err == "notFound") {
        res.status(400).json({ err: "Thread Not found" });
      } else {
        res.json(data);
      }
    }
  );
};
// all thread
exports.showAllThread = (req, res) => {
  // console.log(showAThreads);
  let parameter = { hide: false };
  if (req.query.category) {
    parameter["category"] = req.query.category;
  }
  thread.showThreads(
    req.user._id,
    parameter,
    req.user.blocked,
    (err, threads) => {
      if (err) {
        console.log(err);
        res.status(500).json({ err: "Server Error" });
      } else res.json(threads);
    }
  );
};
// send userId as parameter
// require user id
exports.showUserThread = (req, res) => {
  let parameter = { user: req.params.userId, hide: false };
  thread.showThreads(
    req.user._id,
    parameter,
    req.user.blocked,
    (err, threads) => {
      if (err) {
        console.log(err);
        res.status(500).json({ err: "Server Error" });
      } else res.json(threads);
    }
  );
};
// send threadId as paramenter in URL
// require thread id
exports.showOneThread = (req, res) => {
  // let parameter = { _id: req.params.threadId };
  let parameter = { _id: req.params.threadId, hide: false };
  thread.showThreads(
    req.user._id,
    parameter,
    req.user.blocked,
    (err, threads) => {
      if (err) {
        res.status(500).json({ err: "Server Error" });
      } else res.json(threads);
    }
  );
};

// show loggedIn user Thread
exports.showOwnThread = (req, res) => {
  const user = req.user._id;
  let parameter = { user: user };
  thread.showThreads(
    req.user._id,
    parameter,
    req.user.blocked,
    (err, threads) => {
      // console.log(threads);
      if (err) {
        console.log(err);
        res.status(500).json({ err: "Server Error" });
      } else res.json(threads);
    }
  );
};
//
exports.deleteThread = (req, res) => {
  const threadId = req.params.threadId;
  const role = req.user.role;
  thread.deleteThread(threadId, role, req.user._id, (err) => {
    if (!err) {
      res.json({ success: "Success" });
    } else {
      if (err && err == "noPermission") {
        res.status(400).json({ err: "Un Authorized" });
        return;
      }
      res.status(500).json({ err: "internal server Error" });
    }
  });
};
// export function editThread(req, res) {}
