const express = require('express');
const router = express.Router();
const { getConfig, postConfig } = require('../controllers/configController');

router.get('/config', getConfig);
router.post('/config', postConfig);

module.exports = router;
