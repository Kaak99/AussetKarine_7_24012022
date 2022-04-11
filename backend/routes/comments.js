// tests (à retirer)
console.log(` ----> comments-route`);

const express = require('express');
const router = express.Router();

// const auth = require('../middleware/auth');
//const multer = require('../middleware/multer-config');

const commentsController = require('../controllers/comments');


//router.get('/', commentsController.getAllComments);
router.post('/', commentsController.createComments);
//router.get('/:id', postsController.getOnePostsComments);
//router.put('/:id', commentsController.modifyComments);
router.delete('/:id', commentsController.deleteComments);



// router.posts('/:id/thumb', postsController.thumbPosts);

module.exports = router;