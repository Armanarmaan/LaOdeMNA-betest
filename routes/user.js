const express = require("express");
const verifyToken = require('../middlewares/verifyToken');
const user = require("../controllers/user");
const router = express.Router();

router.post("/", verifyToken, user.createUser);
router.get("/identity/:number", verifyToken, user.getUserByIdentity);
router.get("/account/:number", verifyToken, user.getUserByAccount);
router.post("/update/identity/:number", verifyToken, user.updateByIdentity);
router.delete("/delete/identity/:number", verifyToken, user.deleteByIdentity);

module.exports = router;