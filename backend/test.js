require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

model.generateContent(['Respond with {"test": 123} as JSON', {inlineData: {data: Buffer.from('hello').toString('base64'), mimeType: 'text/plain'}}])
  .then(r => console.log(r.response.text()))
  .catch(e => console.error('ERROR:', e.message));
