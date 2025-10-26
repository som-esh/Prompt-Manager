const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');

const app = express();
app.use(bodyParser.json());

let promptData = [];

function connectToRabbitMQ() {
  amqp.connect('amqp://guest:guest@rabbitmq:5672/', function (error0, connection) {
    if (error0) {
      console.error("[AMQP]", "connect error:", error0.message);
      console.log("[AMQP] Retrying connection in 5 seconds...");
      return setTimeout(connectToRabbitMQ, 5000);
    }
    connection.on("error", function (err) {
      if (err.message !== "Connection closing") {
        console.error("[AMQP] conn error", err.message);
      }
    });
    connection.on("close", function () {
      console.error("[AMQP] reconnecting");
      return setTimeout(connectToRabbitMQ, 5000);
    });

    console.log("[AMQP] connected");
    connection.createChannel(function (error1, channel) {
      if (error1) {
        console.error("[AMQP] channel error", error1.message);
        return;
      }
      const exchange = 'prompts';

      channel.assertExchange(exchange, 'fanout', {
        durable: false
      });

      channel.assertQueue('', {
        exclusive: true
      }, function (error2, q) {
        if (error2) {
          console.error("[AMQP] queue error", error2.message);
          return;
        }
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
        channel.bindQueue(q.queue, exchange, '');

        channel.consume(q.queue, function (msg) {
          if (msg.content) {
            try {
              const updatedPrompts = JSON.parse(msg.content.toString());
              promptData = updatedPrompts;
              console.log(" [x] Received updated prompt data");
            } catch (e) {
              console.error("Error parsing message content", e);
            }
          }
        }, {
          noAck: true
        });
      });
    });
  });
}

connectToRabbitMQ();

app.get('/most-viewed', (req, res) => {
  if (!promptData || promptData.length === 0) return res.json({});
  const report = promptData.reduce((acc, prompt) => {
    const tool = prompt.aiTool || 'Unknown';
    acc[tool] = (acc[tool] || 0) + (prompt.views || 0);
    return acc;
  }, {});
  res.json(report);
});

app.get('/most-favorited', (req, res) => {
  if (!promptData || promptData.length === 0) return res.json([]);
  const report = [...promptData].sort((a, b) => (b.favorites || 0) - (a.favorites || 0)).slice(0, 10);
  res.json(report);
});

app.get('/most-copied', (req, res) => {
  if (!promptData || promptData.length === 0) return res.json([]);
  const report = [...promptData].sort((a, b) => (b.copies || 0) - (a.copies || 0)).slice(0, 10);
  res.json(report);
});


const port = 3000;
app.listen(port, () => {
  console.log(`Reporting service listening on port ${port}`);
});
