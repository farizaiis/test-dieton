const express = require('express')
const router = express.Router()
const foods = require('../controllers/foodsController')

router.get('/', foods.getAllFoods)
router.get('/:id', foods.getOneFoods)
router.post('/', foods.createFoods)
router.put('/', foods.updateFoods)
router.delete('/', foods.deleteFoods)

module.exports = router