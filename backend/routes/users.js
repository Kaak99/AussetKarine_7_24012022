// tests (à retirer)
console.log(` ----> user-route`);

const express = require("express");
const router = express.Router();
const checksignUp = require("../middleware/checksignUp");
const checkModifyUser = require("../middleware/checkModifyUser");

const auth = require("../middleware/auth"); //partout sauf signup&login!
const multer = require("../middleware/multer-config");
//multer necessaire si utilisation selecteur de fichier
const usersController = require("../controllers/users");

router.get("/", auth, usersController.getAllUsers);
router.get("/:id", auth, usersController.getOneUsers);
router.get("/allLikes/:id", auth, usersController.getAllLikes4OneUser);
router.get("/allComments/:id", auth, usersController.getAllComments4OneUser);

router.post("/signup", multer, checksignUp, usersController.signup);
router.post("/login", usersController.login);
router.delete("/:id", auth, usersController.deleteUsers);
router.delete("/test/:id", usersController.test); //pour test, à supprimer
router.delete("/test2/:id", usersController.test2); //pour test, à supprimer
router.put("/:id", auth, multer, checkModifyUser, usersController.modifyUser);
// router.put("/activity/:id", usersController.changeUserActivity);
// router.put("/rights/:id", usersController.changeRights);

module.exports = router;
