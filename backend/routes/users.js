// tests (à retirer)
console.log(` ----> user-route`);

const express = require("express");
const router = express.Router();
const checksignUp = require("../middleware/checksignUp");
const checkModifyUser = require("../middleware/checkModifyUser");

const multer = require("../middleware/multer-config");
//multer necessaire si utilisation selecteur de fichier
const usersController = require("../controllers/users");

router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getOneUsers);
router.get("/allLikes/:id", usersController.getAllLikes4OneUser);
router.get("/allComments/:id", usersController.getAllComments4OneUser);

router.post("/signup", multer, checksignUp, usersController.signup);
router.post("/login", usersController.login);
router.delete("/:id", usersController.deleteUsers);
router.put("/:id", multer, checkModifyUser, usersController.modifyUser);
// router.put("/activity/:id", usersController.changeUserActivity);
// router.put("/rights/:id", usersController.changeRights);

module.exports = router;
