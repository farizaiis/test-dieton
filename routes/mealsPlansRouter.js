const express = require('express')
const router = express.Router()
const mealsPlans = require('../controllers/mealsPlansController')

router.post('/', mealsPlans.postMealsPlans)
router.put('/status/:id', mealsPlans.updateStatus)
router.delete('/:id', mealsPlans.deleteMealsPlans)

module.exports = router