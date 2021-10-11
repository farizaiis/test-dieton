const express = require('express')
const router = express.Router()
const usersRoute = require('./users')
// const userCalorieTrackersRoute = require('./calorieTrackers')

router.use('/users', usersRoute)
// router.use('/calorietrackers', userCalorieTrackersRoute)

module.exports = router
