const express = require('express')
const router = express.Router()
const listMeals = require('../controllers/listMealsController')
const { loginCheck } = require('../middlewares/authentication')

router.post('/', loginCheck, listMeals.postListMeals)
router.delete('/:id', loginCheck, listMeals.deleteListMeals)

module.exports = router