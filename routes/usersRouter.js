const express = require('express')
const router = express.Router()
const users = require('../controllers/usersControllers')
const { loginCheck } = require('../middlewares/authentication')
const uploadProfilePic = require('../middlewares/uploadProfilePic')

router.post('/register', uploadProfilePic("profilePic"), users.signup);
router.post('/signin', users.signin);
router.delete('/delete/:id', loginCheck, users.delete);
router.put('/update/:id', loginCheck, uploadProfilePic("profilePic"), users.update);
router.get('/:id', loginCheck, users.getUserById);

module.exports = router;