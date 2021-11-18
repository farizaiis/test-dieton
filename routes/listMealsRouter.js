const express = require('express');
const router = express.Router();
const listMeals = require('../controllers/listMealsController');
const { loginCheck } = require('../middlewares/authentication');

router.get('/', loginCheck, listMeals.getAll);
router.post('/', loginCheck, listMeals.postListMeals);
router.delete('/:id', loginCheck, listMeals.deleteListMeals);
router.put('/:id', loginCheck, listMeals.updateQtyMeals);

module.exports = router;
