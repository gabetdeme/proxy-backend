const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const helmet = require("helmet");

const app = express();
app.use(helmet());

app.use("/proxy", (req, res, next) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Missing ?url=");

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true,             // WebSocket support for Discord/Chess/etc
    secure: false,
    followRedirects: true,
    selfHandleResponse: false,
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader("Origin", target);
    },
    onProxyRes: (proxyRes) => {
      delete proxyRes.headers["x-frame-options"];
      delete proxyRes.headers["content-security-policy"];
    },
    logLevel: "debug"
  })(req, res, next);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Proxy running on port", PORT));
