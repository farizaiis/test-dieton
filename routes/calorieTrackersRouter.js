const express = require('express')
const router = express.Router()
const calorieTracker = require('../controllers/calorieTrackers')
const { loginCheck } = require('../middlewares/authentication')

router.get('/', loginCheck, calorieTracker.getDataById)

module.exports = router;