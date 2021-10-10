const express = require('express')
const router = express.Router()
const listMealsRouter = ('./listMealsRouter')

router.use('/listmeals', listMealsRouter)

module.exports = router
