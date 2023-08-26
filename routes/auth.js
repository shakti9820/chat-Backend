const isAuth=require("../middleware/isAuth") 
const {
  login,
  register,
  getAllUsers,
  logOut,
  getData,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/getData", isAuth,getData);
router.get("/allusers/:id", isAuth,getAllUsers);
router.get("/logout/:id",isAuth, logOut);

module.exports = router;
