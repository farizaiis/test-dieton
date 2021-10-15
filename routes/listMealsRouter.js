const express = require('express')
const router = express.Router()
const listMeals = require('../controllers/listMealsController')
const { loginCheck } = require('../middlewares/authentication')
const { authAdmin } = require('../middlewares/authorization')

router.get('/', loginCheck, listMeals.getAll)
router.post('/', loginCheck, listMeals.postListMeals)
router.delete('/:id', loginCheck, listMeals.deleteListMeals)
router.put('/:id', loginCheck, authAdmin, listMeals.updateQtyMeals)

module.exports = router