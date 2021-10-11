const express = require('express')
const router = express.Router()
const listMealsRouter = require ('./listMealsRouter')
const mealsPlansRouter = require ('./mealsPlansRouter')
const foodsRouter = require ('./foodsRouter')
// const nutritionFacts = ('./nutritionFactsRouter')
const usersRouter = require ('./usersRouter')

// router.use('/facts', nutritionFacts)
router.use('/users', usersRouter)
router.use('/foods', foodsRouter)
router.use('/listmeals', listMealsRouter)
router.use('/mealsplan', mealsPlansRouter)

module.exports = router
