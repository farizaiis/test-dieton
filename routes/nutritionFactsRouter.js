const express = require('express')
const router = express.Router()
const Fact = require('../controllers/factsController')
const uploadPoster = require('../middlewares/uploadPoster')


router.get('/', Fact.getAllFacts)
router.get('/:id', Fact.getOneFact)
router.post('/', uploadPoster('poster'), Fact.postFacts)
router.put('/:id', Fact.updateFacts)
router.delete('/:id', Fact.deleteFacts)

module.exports = router