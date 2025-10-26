const express = require('express');
const winston = require('winston');
const Consul = require('consul');
const consul = new Consul(
  {
    host: 'consul',
    port: '8500',
    promisify: true
  }
);
const app = express();
app.use(express.json());

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

const users = [
  { id: 1, username: 'user1', password: 'pass1' },
  { id: 2, username: 'user2', password: 'pass2' }
];


app.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    logger.info(`Login successful for user${user.username}`);
    return res.json({ success: true, userId: user.username });
  } else {
    logger.warn(`Failed login attempt for username ${username}`);
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

consul.agent.service.register({
  name: 'auth-service',
  address: 'auth-service',
  port: 3001,
  check: {
    http: 'http://auth-service:3001/health',
    interval: '10s'
  }
});

app.get('/health', (req, res) => res.sendStatus(200));
app.listen(3001, () => console.log('Auth Service running on port 3001'));