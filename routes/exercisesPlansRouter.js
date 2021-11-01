const express = require('express')
const router = express.Router()
const exercisesPlans = require('../controllers/exercisesPlansController')
const { loginCheck } = require('../middlewares/authentication')

router.get('/', loginCheck, exercisesPlans.getAll)
router.post('/', loginCheck, exercisesPlans.postListExercises)
router.delete('/:id', loginCheck, exercisesPlans.deleteListExercises)
router.put('/:id', loginCheck, exercisesPlans.updateList)
router.put('/status/:id', loginCheck, exercisesPlans.updateStatus)

module.exports = router