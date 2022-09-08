// tests (à retirer)
console.log(` ----> likes-route`);

const express = require("express");
const router = express.Router();

// const auth = require('../middleware/auth');

const likesController = require("../controllers/likes");

//router.post("/", likesController.createLikes);
// router.put("/:id", likesController.modifyLikes);
router.post("/", likesController.modifyLikes); //essai2en1
router.get("/count/:id", likesController.getLikesNumber4OnePost);
router.get("/:id", likesController.getAllLikes4OnePost);

// router.posts('/:id/thumb', postsController.thumbPosts);

module.exports = router;
