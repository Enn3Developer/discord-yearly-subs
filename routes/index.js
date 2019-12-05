const express = require('express');
const router = express.Router();

const mainController = require('../controllers/main.controller');

// Stats API: discord yearly subs + patrons
router.get('/', mainController.statsInfo);

module.exports = router;
