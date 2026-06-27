const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.generateMockTest = async (req, res) => {
    try {
        const { subject, difficulty, qCount } = req.body;

        if (!subject) {
            return res.status(400).json({ success: false, message: 'Subject is required' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const prompt = `
        You are an expert academic tutor. Generate a multiple-choice quiz about "${subject}".
        The difficulty level should be "${difficulty}".
        Generate exactly ${qCount} questions.
        
        Respond ONLY with a raw JSON array of objects. Do not include markdown formatting or \`\`\`json wrappers.
        Each object must have exactly the following structure:
        {
          "q": "The question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correct": <integer index of correct option, 0 to 3>
        }
        `;

        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();

        // Strip out markdown if present
        if (text.startsWith('```json')) {
            text = text.substring(7);
            if (text.endsWith('```')) {
                text = text.substring(0, text.length - 3);
            }
        } else if (text.startsWith('```')) {
            text = text.substring(3);
            if (text.endsWith('```')) {
                text = text.substring(0, text.length - 3);
            }
        }

        const questions = JSON.parse(text);

        res.status(200).json({ success: true, questions });
    } catch (error) {
        console.error('Error generating mock test:', error);
        res.status(500).json({ success: false, message: 'Failed to generate mock test. Please try again.' });
    }
};
