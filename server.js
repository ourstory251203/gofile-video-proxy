const express = require('express');
const cors = require('cors');
const request = require('request');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/proxy', (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send('Missing "url" query parameter.');
  }

  console.log(`Proxying request to: ${url}`);
  request({ url, followRedirect: true }).pipe(res);
});

app.listen(PORT, () => {
  console.log(`CORS Proxy running on port ${PORT}`);
});
