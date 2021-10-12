const express = require('express')
const router = express.Router()
const weightMeasures = require('./weightMeasures')

router.use('/wms', weightMeasures)

module.exports = router