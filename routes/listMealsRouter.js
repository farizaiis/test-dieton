const express = require('express')
const router = express.Router()
const listMeals = require('../controllers/listMealsController')

router.post('/', listMeals.postListMeals)
router.delete('/:id', listMeals.deleteListMeals)
