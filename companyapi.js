const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/company_holdings', async (req, res) => {
  const { currency } = req.body;
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/companies/public_treasury/${currency.toLowerCase()}`);
    const holdings = response.data;
    res.status(200).json(holdings);
  } catch (error) {
    console.error('Error fetching company holdings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
