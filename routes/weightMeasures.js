const express = require('express')
const router = express.Router()
const weightMeasures = require('../controllers/weightMeasuresController')

router.post('/', weightMeasures.postWeight)
router.get('/', weightMeasures.getWeight)

module.exports = router