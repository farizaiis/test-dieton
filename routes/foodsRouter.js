const express = require('express')
const router = express.Router()
const foods = require('../controllers/foodsController')
const { loginCheck } = require('../middlewares/authentication')
const { authAdmin } = require('../middlewares/authorization')

router.get('/', loginCheck, foods.getAllFoods)
router.get('/:id', loginCheck, foods.getOneFoods)
router.post('/', loginCheck,  foods.createFoods)
router.put('/:id', loginCheck, authAdmin, foods.updateFoods)
router.delete('/:id', loginCheck, authAdmin, foods.deleteFoods)

module.exports = router