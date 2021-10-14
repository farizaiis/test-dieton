const express = require('express')
const router = express.Router()
const weightMeasures = require('./weightMeasures')
const listMealsRouter = require ('./listMealsRouter')
const mealsPlansRouter = require ('./mealsPlansRouter')
const foodsRouter = require ('./foodsRouter')
const factsRouter = require ('./nutritionFactsRouter')
const usersRouter = require ('./usersRouter')
const calorieRouter = require ('./calorieTrackersRouter')

router.use('/facts', factsRouter)
router.use('/users', usersRouter)
router.use('/foods', foodsRouter)
router.use('/listmeals', listMealsRouter)
router.use('/mealsplan', mealsPlansRouter)
router.use('/wms', weightMeasures)
router.use('/calorietrackers', calorieRouter)

module.exports = router