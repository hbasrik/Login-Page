const admin = require("../config/firebase");
const db = admin.firestore();

const getConfig = async (req, res) => {
  try {
    // console.log('GET /config is called');
    const snapshot = await db.collection("config").get();

    const parameters = [];
    snapshot.forEach((doc) => {
      parameters.push({ id: doc.id, ...doc.data() });
    });

    // console.log('Parameters:', parameters);
    res.status(200).json({ parameters });
  } catch (error) {
    console.error("Error in getConfig:", error);
    res.status(500).json({ error: "Error fetching config" });
  }
};

const postConfig = async (req, res) => {
  try {
    const { key, value, description } = req.body;

    const now = new Date();

    const datePart = now.toLocaleDateString("en-GB");
    const timePart = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const formattedDate = `${datePart} ${timePart}`;

    const docRef = await db.collection("config").add({
      key,
      value,
      description,
      createDate: formattedDate,
      updatedAt: formattedDate,
    });

    res.status(201).json({ message: "Config added", id: docRef.id });
  } catch (error) {
    console.error("Error saving config:", error);
    res.status(500).json({ error: "Error saving config" });
  }
};

const updateConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const { key, value, description, updatedAt: clientUpdatedAt } = req.body;

    const docRef = db.collection("config").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Document not found" });
    }

    const serverData = doc.data();

    if (serverData.updatedAt && serverData.updatedAt !== clientUpdatedAt) {
      return res.status(409).json({
        error:
          "Conflict detected. The document has been modified by another user.",
        serverUpdatedAt: serverData.updatedAt,
      });
    }

    const now = new Date();
    const datePart = now.toLocaleDateString("en-GB");
    const timePart = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const newUpdatedAt = `${datePart} ${timePart}`;

    await docRef.update({
      key,
      value,
      description,
      updatedAt: newUpdatedAt,
    });

    res.status(200).json({
      message: "Parameter updated successfully",
      updatedAt: newUpdatedAt,
    });
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ error: "Update failed" });
  }
};

const deleteConfig = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("config").doc(id).delete();
    res.status(200).json({ message: "Parameter deleted succesfully" });
  } catch (error) {
    console.error("Error deleting parameter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getConfig, postConfig, updateConfig, deleteConfig };
