// tests (à retirer)
console.log(` ----> likes-route`);

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const likesController = require("../controllers/likes");

router.post("/", auth, likesController.modifyLikes); //cree & modifie
router.get("/count/:id", auth, likesController.getLikesNumber4OnePost);
router.get("/count", auth, likesController.getCountperPost);
router.get("/:id", auth, likesController.getAllLikes4OnePost);

module.exports = router;
