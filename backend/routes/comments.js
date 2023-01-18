// tests (à retirer)
console.log(` ----> comments-route`);

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const commentsController = require("../controllers/comments");
const checkComment = require("../middleware/checkComment");

router.get("/", auth, commentsController.getAllComments);
router.get("/:id", auth, commentsController.getAllComments4OnePost);
router.get("/count/:id", auth, commentsController.getCommentsNumber4OnePost);

router.post("/", auth, checkComment, commentsController.createComments);
//router.get('/:id', postsController.getOnePostsComments);
router.put("/:id", auth, checkComment, commentsController.modifyComments);
router.delete("/:id/:idpost", auth, commentsController.deleteComments);

// router.posts('/:id/thumb', postsController.thumbPosts);

module.exports = router;
