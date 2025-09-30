const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');


const app = express();
const PORT = process.env.PORT || 3000;


app.use('/proxy', (req, res, next) => {
  const target = req.query.url;
  if (!target) return res.status(400).send('Missing url parameter');


  createProxyMiddleware({
    target: target.startsWith('http') ? target : 'http://' + target,
    changeOrigin: true,
    secure: false, // allow HTTPS sites
    logLevel: 'debug',
  })(req, res, next);
});


app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
