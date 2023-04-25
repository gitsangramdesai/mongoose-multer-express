var express = require('express');
var router = express.Router();
var User = require('../models/User').User;
var { upload } = require('../utils/upload')

//single input type file field
router.post('/signin', upload.single('profilePic'), async function (req, res, next) {
  var user = new User({
    username: req.body.username,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    profilePic: req.file.filename
  });
  var usernameTaken = await User.findByUserName(req.body.username)
  if (usernameTaken.length == 0) {
    console.log("Hashing password")
    var newUser = await user.setPassword(req.body.password)
    var result = await newUser.save()
    res.json({ "msg": "saved", data: result })
  } else {
    res.json({ "msg": "username already taken" })
  }
});

//two input type file fields
router.post('/signin/twofilefield', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'profilePic', maxCount: 10 }]), async function (req, res, next) {
  //profilePic
  var profilePics = []
  req.files["profilePic"].forEach((fl) => {
    profilePics.push(fl.filename)
  })

  //resume
  var resume = req.files["resume"][0].filename

  var user = new User({
    username: req.body.username,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    profilePics: profilePics,
    resume: resume
  });

  var usernameTaken = await User.findByUserName(req.body.username)
  if (usernameTaken.length == 0) {
    console.log("Hashing password")
    var newUser = await user.setPassword(req.body.password)
    var result = await newUser.save()
    res.json({ "msg": "saved", data: result })
  } else {
    res.json({ "msg": "username already taken" })
  }
});


//multiple files uploaded against single input type file
router.post('/signin/multiupload', upload.array('profilePic', 10), async function (req, res, next) {
  var profilePics = []
  req.files.forEach((fl) => {
    profilePics.push(fl.filename)
  })

  var user = new User({
    username: req.body.username,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    profilePic: profilePics[0],
    profilePics: profilePics
  });

  var usernameTaken = await User.findByUserName(req.body.username)
  if (usernameTaken.length == 0) {
    console.log("Hashing password")
    var newUser = await user.setPassword(req.body.password)
    var result = await newUser.save()
    res.json({ "msg": "saved", data: result })
  } else {
    res.json({ "msg": "username already taken" })
  }


});
module.exports = router;
