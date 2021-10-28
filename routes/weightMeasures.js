const express = require('express')
const router = express.Router()
const weightMeasures = require('../controllers/weightMeasuresController')
const { loginCheck } = require('../middlewares/authentication')
const { authAdmin } = require('../middlewares/authorization')

router.post('/', loginCheck, weightMeasures.updateWeight)
router.get('/', loginCheck, weightMeasures.getWeight)
router.put('/', loginCheck, weightMeasures.updateWeight)
router.delete('/:id', loginCheck, authAdmin, weightMeasures.deleteWeight)

module.exports = router