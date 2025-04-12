const express = require('express');
const presentationController = require('../controllers/presentationController');

const router = express.Router();

// Presentation routes
router.post('/presentation/generate', presentationController.generatePresentation);
router.get('/presentation/status/:id', presentationController.getPresentationStatus);

module.exports = router;