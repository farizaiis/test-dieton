const express = require('express')
const cors = require('cors')
const app = express()
const Router = require('./routes/index')
const moment = require('moment')

app.use(cors())
app.use(express.json())
app.use('/v1', Router)

app.get("/", (req,res)=>{
    res.json({
        message:"server running",
        serverTime: moment(new Date()).local()
    })
})

app.get('*', function(req, res) {
    res.status(404).send('not found')
})

module.exports = app
