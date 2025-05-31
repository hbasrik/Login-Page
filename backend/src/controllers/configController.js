const admin = require('../config/firebase');
const db = admin.firestore();

const getConfig = async (req, res) => {
    try {
        console.log('GET /config is called');
        const snapshot = await db.collection('config').get();
    
        const parameters = [];
        snapshot.forEach(doc => {
          parameters.push({ id: doc.id, ...doc.data() });
        });
    
        console.log('Parameters:', parameters); 
        res.status(200).json({ parameters });
      } catch (error) {
        console.error('Error in getConfig:', error); 
        res.status(500).json({ error: 'Error fetching config' });
      }
};

const postConfig = async (req, res) => {
  try {
    const { key, value, description } = req.body;
    const createDate = new Date().toISOString();

    const docRef = await db.collection('config').add({
      key,
      value,
      description,
      createDate
    });

    res.status(201).json({ message: 'Config added', id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Error saving config' });
  }
};

module.exports = { getConfig, postConfig };
