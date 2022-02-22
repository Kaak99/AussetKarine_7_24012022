// tests (à retirer)
console.log(` ----> post-route`);

const express = require('express');
const router = express.Router();

// const auth = require('../middleware/auth');
// const multer = require('../middleware/multer-config');

const postController = require('../controllers/post');


router.get('/', postController.getAllPost);
router.post('/', postController.createPost);//multer ici
router.get('/:id', postController.getOnePost);
router.put('/:id', postController.modifyPost);//multer ici
router.delete('/:id', postController.deletePost);

router.post('/:id/thumb', postController.thumbPost);

module.exports = router;