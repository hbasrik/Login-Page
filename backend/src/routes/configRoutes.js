const express = require('express');
const router = express.Router();
const { getConfig, postConfig, updateConfig, deleteConfig } = require('../controllers/configController');
const verifyFirebaseToken = require('../middlewares/verifyFirebaseToken') 

router.get('/config', getConfig);
router.post('/config', postConfig);
router.patch('/config/:id', verifyFirebaseToken, updateConfig);
router.delete('/config/:id', verifyFirebaseToken, deleteConfig)

module.exports = router;
