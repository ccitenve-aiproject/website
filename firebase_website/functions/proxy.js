const functions = require('firebase-functions');

// Replace with your Apps Script exec URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxz3Lb_3LINDVvo7mCL5R8lP7to2-6uCeO-lJCMxqRoWUL7N-5CFv_e_Sg6XzGRgaHJ/exec';

exports.incrementVisitCount = functions.https.onRequest(async (req, res) => {
  // CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).send('');

  try {
    const url = APPS_SCRIPT_URL;
    const options = {
      method: req.method,
      headers: {}
    };

    if (req.method === 'POST') {
      options.headers['Content-Type'] = req.get('Content-Type') || 'application/json';
      options.body = JSON.stringify(req.body || {});
    }

    const response = await fetch(url, options);
    const text = await response.text();

    // Forward status and body
    res.status(response.status).send(text);
  } catch (err) {
    console.error('Proxy error', err);
    res.status(500).json({ error: String(err) });
  }
});
