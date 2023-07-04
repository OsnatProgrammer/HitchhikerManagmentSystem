const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { auth, authadmin } = require("../middlewares/auth");
const { UserModel, validUser, validLogin, createToken } = require("../models/userModel")
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");


router.get("/", async (req, res) => {

  try {
    res.json({msg:"user working!!"})
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

//http://localhost:3001/users/usersList
router.get("/usersList", authadmin, async (req, res) => {
  let sort = req.query.sort || "name";
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {

    let data = await UserModel.find({}, { password: 0 })
      .sort({ [sort]: reverse });
    res.json(data)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

//get personal email
//http://localhost:3001/users/myEmail
router.get("/myEmail", auth, async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.tokenData._id }, { email: 1 })
    res.json(user);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

//get personal details
//http://localhost:3001/users/myInfo
router.get("/myInfo", auth, async (req, res) => {

  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).json({ msg: "You need to send token to this endpoint url" })
  }
  try {
    let tokenData = jwt.verify(token, config.tokenSecret);

    let user = await UserModel.findOne({ _id: tokenData._id }, { password: 0 });
    res.json(user);

  }
  catch (err) {
    return res.status(401).json({ msg: "Token not valid or expired" })
  }

})

//add user
//http://localhost:3001/users
router.post("/", async (req, res) => {
  let validBody = validUser(req.body);

  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);

    user.password = await bcrypt.hash(user.password, 10);

    await user.save();
    user.password = "********";
    res.status(201).json(user);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(500).json({ msg: "Email already in system, try log in", code: 11000 })

    }
    console.log(err);
    res.status(500).json({ msg: "err", err })
  }
})

//user login
//http://localhost:3001/users/login
router.post("/login", async (req, res) => {
  let validBody = validLogin(req.body);

  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({ msg: "Password or email is worng ,code:1" })
    }

    let authPassword = await bcrypt.compare(req.body.password, user.password);
    if (!authPassword) {
      return res.status(401).json({ msg: "Password or email is wrong ,code:2" });
    }

    let newToken = createToken(user._id, user.role);
    res.json({ token: newToken, user});
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// http://localhost:3001/users/updateStatus/:id
router.patch("/updateStatus/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const newStatus = req.body.status;

    let data = await UserModel.updateOne({ _id: userId }, { status: newStatus });

    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error", err });
  }
});


// http://localhost:3001/users/updateImage/:id
router.patch("/updateImage/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const newImage = req.body.imageUrl;

    let data = await UserModel.updateOne({ _id: userId }, { imageUrl: newImage });

    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error", err });
  }
});

//delete by userId
//http://localhost:3001/users/:idDel
router.delete("/:idDel", auth, async (req, res) => {
  try {
    let idDel = req.params.idDel;
    let data;

    if (req.tokenData.role == "admin") {
      data = await UserModel.deleteOne({ _id: idDel })
    } else {
      data = await UserModel.deleteOne({ _id: idDel, user_id: req.tokenData._id })
    }
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

module.exports = router;