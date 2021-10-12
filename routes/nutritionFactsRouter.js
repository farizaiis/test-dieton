const express = require('express')
const router = express.Router()
const Fact = require('../controllers/factsController')


router.get('/', Fact.getAllFacts)
router.get('/:id', Fact.getOneFact)
router.post('/', Fact.postFacts)
router.put('/', Fact.updateFacts)
router.delete('/:id', Fact.deleteFacts)
module.exports = router