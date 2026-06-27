const { GoogleGenerativeAI } = require('@google/generative-ai');

const solveDoubt = async (req, res) => {
  try {
    const { question, history, deepMode } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Please provide a question.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = deepMode ? 'gemini-pro-latest' : 'gemini-flash-latest';
    const model = genAI.getGenerativeModel({ model: modelName });

    // Construct prompt with history context
    let prompt = "You are an expert AI academic tutor. Provide a detailed, step-by-step academic solution tailored to the user's question.\n";
    if (deepMode) {
      prompt += "DEEP MODE ACTIVATED: Provide an exceptionally thorough, PhD-level analysis of the concept, including edge cases, proofs (if applicable), and deep theoretical reasoning.\n";
    }

    if (history && history.length > 0) {
      prompt += "\nPrevious conversation context:\n";
      history.forEach(msg => {
        prompt += `${msg.role === 'user' ? 'User' : 'Tutor'}: ${msg.text}\n`;
      });
      prompt += "\n";
    }

    prompt += `User's latest question: ${question}\n\nProvide the answer formatted beautifully using Markdown.`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    res.status(200).json({ answer: text });
  } catch (error) {
    console.error('Error generating chat response:', error);
    res.status(500).json({ error: 'Gemini Error: ' + error.message, details: error.stack });
  }
};

module.exports = {
  solveDoubt
};
