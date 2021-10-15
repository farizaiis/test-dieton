const express = require('express')
const router = express.Router()
const mealsPlans = require('../controllers/mealsPlansController')
const { loginCheck } = require('../middlewares/authentication')

router.post('/', loginCheck, mealsPlans.postMealsPlans)
router.get('/', loginCheck, mealsPlans.getUserPlans)
router.put('/status/', loginCheck, mealsPlans.updateStatus)
router.delete('/:id', loginCheck, mealsPlans.deleteMealsPlans)

module.exports = router