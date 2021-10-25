const express = require('express')
const router = express.Router()
const exercises = require('../controllers/exercisesController')
const { loginCheck } = require('../middlewares/authentication')
const { authAdmin } = require('../middlewares/authorization')
const uploadLogoExercise = require('../middlewares/uploadLogoExercise')

router.get('/', loginCheck, exercises.getAllExercises)
router.get('/:id', loginCheck, exercises.getOneExercises)
router.post('/', loginCheck, authAdmin, uploadLogoExercise('logoExercise') , exercises.createExercises)
router.put('/:id', loginCheck, authAdmin, uploadLogoExercise('logoExercise'), exercises.updateExercises)
router.delete('/:id', loginCheck, authAdmin, exercises.deleteExercises)

module.exports = router