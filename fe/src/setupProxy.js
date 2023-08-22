// 此文件用于配置proxy 在开发阶段解决跨域的问题
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target : 'http://127.0.0.1:5000',
            changeOrigin : true,
        })
    );
};