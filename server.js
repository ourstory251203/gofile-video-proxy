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

  const headers = {
    'User-Agent': req.headers['user-agent'],
    'Range': req.headers['range'] || '',
  };

  console.log(`Proxying request to: ${url}`);

  request
    .get({ url, headers, followRedirect: true })
    .on('response', (response) => {
      // Forward important headers for video streaming
      res.setHeader('Content-Type', response.headers['content-type'] || 'video/mp4');
      if (response.headers['content-length']) {
        res.setHeader('Content-Length', response.headers['content-length']);
      }
      if (response.headers['accept-ranges']) {
        res.setHeader('Accept-Ranges', response.headers['accept-ranges']);
      }
      if (response.headers['content-range']) {
        res.setHeader('Content-Range', response.headers['content-range']);
      }
    })
    .on('error', (err) => {
      console.error('Error in proxy request:', err.message);
      res.status(500).send('Failed to fetch video');
    })
    .pipe(res);
});

app.listen(PORT, () => {
  console.log(`CORS Proxy running on port ${PORT}`);
});
