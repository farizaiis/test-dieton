const express = require('express')
const router = express.Router()
const users = require('../controllers/usersControllers')
const { loginCheck } = require('../middlewares/authentication')
const { authAdmin } = require('../middlewares/authorization')
const uploadProfilePic = require('../middlewares/uploadProfilePic')

router.post('/register', uploadProfilePic("profilePic"), users.signup);
router.post('/signin', users.signin);
router.delete('/delete/:id', loginCheck, users.delete);
router.put('/update', loginCheck, uploadProfilePic("profilePic"), users.updateUserProfile);
router.get('/userprofile', loginCheck, users.getUserById);
router.get('/', loginCheck, authAdmin, users.getAllUser)

module.exports = router;