const express = require('express')
const router = express.Router()
const exercisesPlans = require('../controllers/exercisesPlansController')
const { loginCheck } = require('../middlewares/authentication')
const { authAdmin } = require('../middlewares/authorization')

router.post('/', loginCheck, exercisesPlans.postExercisesPlans)
router.get('/', loginCheck, exercisesPlans.getUserPlans)
router.delete('/:id', loginCheck, authAdmin, exercisesPlans.deleteExercisesPlans)

module.exports = router
