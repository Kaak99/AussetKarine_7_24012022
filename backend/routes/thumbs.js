// tests (à retirer)
console.log(` ----> thumbs-route`);

const express = require('express');
const router = express.Router();

// const auth = require('../middleware/auth');

const thumbsController = require('../controllers/thumbs');


router.put('/:id', thumbsController.modifyThumbs);


// router.posts('/:id/thumb', postsController.thumbPosts);

module.exports = router;