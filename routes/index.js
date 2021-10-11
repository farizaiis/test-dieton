const express = require('express')
const router = express.Router()
const listMealsRouter = require ('./listMealsRouter')
const mealsPlansRouter = require ('./mealsPlansRouter')
const foodsRouter = require ('./foodsRouter')
// const nutritionFacts = ('./nutritionFactsRouter')

// router.use('/facts', nutritionFacts)
router.use('/foods', foodsRouter)
router.use('/listmeals', listMealsRouter)
router.use('/mealsplan', mealsPlansRouter)

module.exports = router