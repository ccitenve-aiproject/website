const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
const counterRef = db.collection("meta").doc("visitCount");

exports.incrementVisitCount = functions.https.onRequest(async (req, res) => {
  // CORS preflight
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    return res.status(204).send('');
  }

  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(counterRef);
      const current = doc.exists ? doc.data().count : 0;
      t.set(counterRef, { count: current + 1 });
    });

    const updatedDoc = await counterRef.get();
    return res.json({ count: updatedDoc.data().count });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
});
