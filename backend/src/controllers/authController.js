const admin = require('../config/firebase')

const signIn = async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const idToken = authHeader.split('Bearer ')[1]

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    return res.status(200).json({ message: 'Sign-in successful', uid: decodedToken.uid })
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = { signIn }
