// tests (à retirer)
console.log(` ----> posts-route`);

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
//multer necessaire si utilisation selecteur de fichier
const postsController = require("../controllers/posts");
const checkPost = require("../middleware/checkPost");

router.get("/", auth, postsController.getAllPosts);
router.post("/", auth, multer, checkPost, postsController.createPosts); //multer ici
router.get("/:id", auth, postsController.getOnePosts);
router.put("/:id", auth, multer, checkPost, postsController.modifyPosts); //multer ici
router.delete("/:id", auth, postsController.deletePosts);

module.exports = router;
