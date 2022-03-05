// tests (à retirer)
console.log(` ----> user-route`);

const express = require('express');
const router = express.Router();
//const checksignUp = require('../middleware/checksignUp');

const usersController = require('../controllers/users');

router.get('/', usersController.getAllUsers);
router.post('/signup', usersController.signup);
//router.post('/login', userController.login);

module.exports = router;