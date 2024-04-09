const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri=process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const fetchCryptoData = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
    return [];
  }
};

const updateCryptoData = async () => {
  const cryptoData = await fetchCryptoData();
  try {
    await client.connect();
    const db = client.db('koinx');
    const cryptoCollection = db.collection('cryptocurrencies');
    await cryptoCollection.deleteMany({});
    await cryptoCollection.insertMany(cryptoData);
    console.log(`${cryptoData.length} cryptocurrencies updated at ${new Date()}`);
  } catch (error) {
    console.error('Error updating cryptocurrency data in MongoDB:', error);
  } finally {
    await client.close();
  }
};

updateCryptoData();
setInterval(updateCryptoData, 3600000); // Run every hour
