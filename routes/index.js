const express = require('express')
const router = express.Router()
const listMealsRouter = ('./listMealsRouter')
const mealsPlansRouter = ('./mealsPlansRouter')

router.use('/listmeals', listMealsRouter)
router.use('/mealsplan', mealsPlansRouter)

module.exports = router