const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/convert_price', async (req, res) => {
  const { fromCurrency, toCurrency, date } = req.body;
  try {
    await client.connect();
    const db = client.db('koinx');
    const cryptoCollection = db.collection('cryptocurrencies');
    const fromCurrencyData = await cryptoCollection.findOne({ symbol: fromCurrency });
    const toCurrencyData = await cryptoCollection.findOne({ symbol: toCurrency });

    if (!fromCurrencyData || !toCurrencyData) {
      return res.status(400).json({ error: 'Invalid currency' });
    }

 

    res.status(200).json({ price });
  } catch (error) {
    console.error('Error converting price:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
