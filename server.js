const express = require('express')
const cors = require('cors')
const app = express()
const Router = require('./routes/index')
const moment = require('moment')
const session = require('cookie-session')
const passport = require('./middlewares/passport')

app.use(cors())
app.use(express.json())
app.use(session({
    name: "user-cookie",
    keys: ["key1", "key2"],
}))
app.use(passport.initialize())
app.use(passport.session())
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
