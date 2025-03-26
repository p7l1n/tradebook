const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://194.87.146.150:5000',
      changeOrigin: true,
    })
  );
};