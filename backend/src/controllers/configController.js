const admin = require('../config/firebase');
const db = admin.firestore();

const getConfig = async (req, res) => {

    try {
        // console.log('GET /config is called');
        const snapshot = await db.collection('config').get();
    
        const parameters = [];
        snapshot.forEach(doc => {
          parameters.push({ id: doc.id, ...doc.data() });
        });
    
        // console.log('Parameters:', parameters); 
        res.status(200).json({ parameters });
      } catch (error) {
        console.error('Error in getConfig:', error); 
        res.status(500).json({ error: 'Error fetching config' });
      }
};

const postConfig = async (req, res) => {
  try {
    const { key, value, description } = req.body;
    const now = new Date();
  const createDate = now.toLocaleString('en-GB', {
   day: '2-digit',
   month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});


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

const updateConfig = async (req, res) => {
  try {
    const { id } = req.params
    const { key, value, description } = req.body

    const docRef = db.collection('config').doc(id)
    await docRef.update({ key, value, description })

    res.status(200).json({ message: 'Parameter updated successfully' })
  } catch (error) {
    console.error('Error updating parameter:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
};

const deleteConfig = async(req,res) => {
  try{
    const {id} = req.params
    await db.collection('config').doc(id).delete()
    res.status(200).json({message: 'Parameter deleted succesfully' })

  }catch(error){
    console.error('Error deleting parameter:', error)
    res.status(500).json({ message: 'Internal server error' })
  }

};




module.exports = { getConfig, postConfig, updateConfig, deleteConfig };
