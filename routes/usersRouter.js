const express = require('express')
const router = express.Router()
const users = require('../controllers/usersControllers')
const { loginCheck } = require('../middlewares/authentication')
const { authAdmin } = require('../middlewares/authorization')
const uploadProfilePic = require('../middlewares/uploadProfilePic')
const uploadCover = require('../middlewares/uploadCover')
const passport = require('../middlewares/passport')
const { googleSignInWebVersion, googleSignInMobVersion } = require('../controllers/usersControllers')



router.post('/register', users.signup);
router.post('/signin', users.signin);
router.delete('/delete/:id', loginCheck, users.delete);
router.put('/update', loginCheck, uploadProfilePic("profilePic"), users.updateUserProfile);
router.put('/updatecover', loginCheck, uploadCover("cover"), users.uploadCover);
router.get('/userprofile', loginCheck, users.getUserById);
router.get('/', loginCheck, authAdmin, users.getAllUser);
router.put('/verifiedaccount/:id', users.verifiedAccount);
router.put('/resetpassword', users.forgotPass);
router.get("/signin/google", passport.authenticate("google", { scope: ["https://www.googleapis.com/auth/plus.login", "profile", "email"] }));
router.get("/failed", (req, res) => res.send("Failed to login, please try again"));
router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/v1/users/failed",
}), googleSignInWebVersion);
router.get("/login/google", googleSignInMobVersion);


module.exports = router;