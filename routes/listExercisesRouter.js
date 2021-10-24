const express = require('express')
const router = express.Router()
const listExercises = require('../controllers/listExercisesController')
const { loginCheck } = require('../middlewares/authentication')

router.get('/', loginCheck, listExercises.getAll)
router.post('/', loginCheck, listExercises.postListExercises)
router.delete('/:id', loginCheck, listExercises.deleteListExercises)
router.put('/:id', loginCheck, listExercises.updateList)

module.exports = router