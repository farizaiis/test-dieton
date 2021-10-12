const express = require('express')
const cors = require('cors')
const app = express()
const Router = require('./routes/index')

const port = 8000

app.use(express.json())
app.use(cors())
app.use('/v1', Router)


app.get('*', function(req, res) {
    res.status(404).send('not found')
})

app.listen(port, () => {
    console.log("Listening on port", port)
})