const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const winston = require('winston');

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request for ${req.url}`);
  next();
});

app.options('*', (req, res) => {
  res.sendStatus(200);
});

app.use('/auth', createProxyMiddleware({
  target: 'http://auth-service:3001',
  changeOrigin: true,
  pathRewrite: { '^/auth': '' }
}));
app.use('/prompts', createProxyMiddleware({
  target: 'http://prompt-service:3000',
  changeOrigin: true,
}));
app.use('/reports', createProxyMiddleware({
  target: 'http://reporting-service:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/reports': ''
  },
}));

app.listen(3000, () => logger.info('API Gateway running on 3000'));




