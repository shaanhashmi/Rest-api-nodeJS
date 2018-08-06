var express = require("express");
var router = express.Router();

var users = require("./user.controller");


router.post("/users", users.user_register);
router.get("/users/:id", users.getUsers);
router.get("/users", users.getUsers);
router.post("/users/login", users.user_login);
router.delete("/users/:id", users.deleteUser);


module.exports = router;
