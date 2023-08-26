const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET;
// console.log(JWT_SECRET);
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    const token=jwt.sign({user},"secretKey");
    // console.log(token);
    return res.json({ status: true, token });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    const token=jwt.sign({user},"secretKey");
    return res.json({ status: true, token });
  } catch (ex) {
    next(ex);
  }
};


module.exports.getData = async (req, res, next) => {
  const userId = (req.userId);
  //  console.log(typeof req.userId);
  try {
    const user = await User.findById({_id:userId}).select('-password');
    // console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // console.log(user);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'An error occurred' });
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "_id",
    ]);
    // console.log(users);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};



module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
