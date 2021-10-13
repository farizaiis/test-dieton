const express = require('express')
const router = express.Router()
const calorieTracker = require('../controllers/calorieTrackers')
const { loginCheck } = require('../middlewares/authentication')
const { authAdmin } = require('../middlewares/authorization')

router.post('/create', loginCheck, calorieTracker.postCalorie);
router.put('/update', loginCheck, calorieTracker.update);
router.delete('/delete', loginCheck, authAdmin, calorieTracker.delete);
router.get('/', loginCheck, calorieTracker.getDataById)

module.exports = router;