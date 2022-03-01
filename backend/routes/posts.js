// tests (à retirer)
console.log(` ----> posts-route`);

const express = require('express');
const router = express.Router();

// const auth = require('../middleware/auth');
// const multer = require('../middleware/multer-config');

const postsController = require('../controllers/posts');


router.get('/', postsController.getAllPosts);
router.post('/', postsController.createPosts);//multer ici
router.get('/:id', postsController.getOnePosts);
router.put('/:id', postsController.modifyPosts);//multer ici
router.delete('/:id', postsController.deletePosts);

// router.posts('/:id/thumb', postsController.thumbPosts);

module.exports = router;