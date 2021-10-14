const express = require('express')
const router = express.Router()
const foods = require('../controllers/foodsController')

router.get('/', foods.getAllFoods)
router.get('/:id', foods.getOneFoods)
router.post('/', foods.createFoods)
router.put('/:id', foods.updateFoods)
router.delete('/:id', foods.deleteFoods)

module.exports = router