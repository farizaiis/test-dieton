const express = require('express');
const router = express.Router();
const Fact = require('../controllers/factsController');
const uploadPoster = require('../middlewares/uploadPoster');
const { loginCheck } = require('../middlewares/authentication');
const { authAdmin } = require('../middlewares/authorization');

router.get('/', loginCheck, Fact.getAllFacts);
router.get('/:id', loginCheck, Fact.getOneFact);
router.post('/', loginCheck, authAdmin, uploadPoster('poster'), Fact.postFacts);
router.put(
    '/:id',
    loginCheck,
    authAdmin,
    uploadPoster('poster'),
    Fact.updateFacts
);
router.delete('/:id', loginCheck, authAdmin, Fact.deleteFacts);

module.exports = router;
