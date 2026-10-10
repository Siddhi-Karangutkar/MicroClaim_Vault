require('dotenv').config({ path: './.env' });
const axios = require('axios');

async function getModels() {
  try {
    const response = await axios.get('https://api.groq.com/openai/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      }
    });
    console.log(response.data.data.map(m => m.id));
  } catch (err) {
    console.error('Error fetching models:', err.message);
  }
}

getModels();
