const express = require('express')
const router = express.Router()
const listMealsRouter = ('./listMealsRouter')
const mealsPlansRouter = ('./mealsPlansRouter')
const foods = ('./foods')
// const nutritionFacts = ('./nutritionFactsRouter')

// router.use('/facts', nutritionFacts)
router.use('/foods', foods)
router.use('/listmeals', listMealsRouter)
router.use('/mealsplan', mealsPlansRouter)

module.exports = router