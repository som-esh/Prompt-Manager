const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PromptSchema = new mongoose.Schema({
  title: String,
  description: String,
  aiTool: String,
  isFavorite: Boolean,
  views: { type: Number, default: 0 },
  copies: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
});

const Prompt = mongoose.model('Prompt', PromptSchema);


let channel = null;

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
    connection.createChannel(function (error1, ch) {
      if (error1) {
        console.error("[AMQP] channel error", error1.message);
        return;
      }
      channel = ch;
      const exchange = 'prompts';
      channel.assertExchange(exchange, 'fanout', {
        durable: false
      });
      console.log("[AMQP] channel created and exchange asserted");
    });
  });
}

connectToRabbitMQ();

async function publishPrompts() {
  if (channel) {
    const allPrompts = await Prompt.find();
    const exchange = 'prompts';
    channel.publish(exchange, '', Buffer.from(JSON.stringify(allPrompts)));
  }
}

app.get('/prompts', async (req, res) => {
  const prompts = await Prompt.find();
  res.json(prompts);
});

app.post('/prompts', async (req, res) => {
  const { title, description, aiTool, isFavorite } = req.body;
  const newPrompt = new Prompt({ title, description, aiTool, isFavorite: isFavorite || false });
  await newPrompt.save();
  publishPrompts();
  res.status(201).json(newPrompt);
});

app.get('/prompts/:id', async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (prompt) {
      prompt.views++;
      await prompt.save();
      publishPrompts();
      res.json(prompt);
    } else {
      res.status(404).send('Prompt not found');
    }
  } catch (error) {
    res.status(500).send('Error finding prompt');
  }
});

app.put('/prompts/:id', async (req, res) => {
  try {
    const { title, description, aiTool, isFavorite } = req.body;
    const prompt = await Prompt.findById(req.params.id);
    if (prompt) {
      prompt.title = title || prompt.title;
      prompt.description = description || prompt.description;
      prompt.aiTool = aiTool || prompt.aiTool;
      if (isFavorite && !prompt.isFavorite) {
        prompt.favorites++;
      }
      prompt.isFavorite = isFavorite !== undefined ? isFavorite : prompt.isFavorite;

      await prompt.save();
      publishPrompts();
      res.json(prompt);
    } else {
      res.status(404).send('Prompt not found');
    }
  } catch (error) {
    res.status(500).send('Error updating prompt');
  }
});

app.delete('/prompts/:id', async (req, res) => {
  try {
    const result = await Prompt.findByIdAndDelete(req.params.id);
    if (result) {
      publishPrompts();
      res.status(204).send();
    } else {
      res.status(404).send('Prompt not found');
    }
  } catch (error) {
    res.status(500).send('Error deleting prompt');
  }
});

app.post('/prompts/:id/copy', async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (prompt) {
      prompt.copies++;
      await prompt.save();
      publishPrompts();
      res.json(prompt);
    } else {
      res.status(404).send('Prompt not found');
    }
  } catch (error) {
    res.status(500).send('Error copying prompt');
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Prompt service listening on port ${port}`);
});
