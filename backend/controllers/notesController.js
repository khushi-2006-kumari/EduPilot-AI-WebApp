const { GoogleGenerativeAI } = require('@google/generative-ai');
const { YoutubeTranscript } = require('youtube-transcript');

const fileToGenerativePart = (file) => {
  let mimeType = file.mimetype;
  // Gemini prefers 'text/plain' for some text-based documents if not PDF
  if (mimeType === 'application/msword' || mimeType.includes('wordprocessingml')) {
     mimeType = 'text/plain'; 
  }
  return {
    inlineData: {
      data: file.buffer.toString('base64'),
      mimeType: mimeType
    },
  };
};

const PROMPT = `Analyze the provided educational material (either text or a document/video).
Generate a structured study guide and flashcards.
Return ONLY a valid JSON object matching the exact schema below, without any markdown formatting wrappers (like \`\`\`json).

SCHEMA:
{
  "subject": "<Predicted Subject e.g., Science, Literature, Computer Science, Economics>",
  "title": "<A catchy, concise title for the notes>",
  "preview": "<A 1-sentence summary of the content>",
  "content": "<Detailed Markdown formatted notes with headings (H3), bullet points, and core concepts.>",
  "keyPointsCount": <Integer number of key concepts identified>,
  "flashcardsCount": <Integer number of flashcards generated>,
  "tags": ["<Tag1>", "<Tag2>"],
  "sampleFlashcard": {
    "question": "<Sample flashcard question>",
    "answer": "<Sample flashcard answer>"
  }
}
`;

const generateNotes = async (req, res) => {
  try {
    const { youtubeUrl } = req.body;
    
    let contentToAnalyze = null;
    let filePart = null;

    if (youtubeUrl) {
      try {
        const transcript = await YoutubeTranscript.fetchTranscript(youtubeUrl);
        contentToAnalyze = transcript.map(t => t.text).join(' ');
      } catch (err) {
        return res.status(400).json({ error: 'Failed to fetch YouTube transcript. Ensure the video has captions.' });
      }
    } else if (req.file) {
      filePart = fileToGenerativePart(req.file);
    } else {
      return res.status(400).json({ error: 'Please provide a file or a YouTube URL.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let result;
    if (contentToAnalyze) {
      result = await model.generateContent([PROMPT, contentToAnalyze]);
    } else {
      result = await model.generateContent([PROMPT, filePart]);
    }

    let text = result.response.text();
    
    // Clean JSON markdown blocks if present
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    const parsedData = JSON.parse(text);
    res.status(200).json(parsedData);

  } catch (error) {
    console.error('Error generating notes:', error);
    res.status(500).json({ error: 'Gemini Error: ' + error.message, details: error.stack });
  }
};

module.exports = {
  generateNotes
};
