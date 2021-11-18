const express = require('express');
const router = express.Router();
const mealsPlans = require('../controllers/mealsPlansController');
const { loginCheck } = require('../middlewares/authentication');
const { authAdmin } = require('../middlewares/authorization');

router.post('/', loginCheck, mealsPlans.postMealsPlans);
router.get('/', loginCheck, mealsPlans.getUserPlans);
router.put('/status/', loginCheck, mealsPlans.updateStatus);
router.delete('/:id', loginCheck, authAdmin, mealsPlans.deleteMealsPlans);

module.exports = router;
