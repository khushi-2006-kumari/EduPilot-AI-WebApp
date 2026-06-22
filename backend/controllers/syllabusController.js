const { GoogleGenerativeAI } = require('@google/generative-ai');



// Helper to convert multer file to inlineData format for Gemini API
const fileToGenerativePart = (file) => {
  let mimeType = file.mimetype;
  // Gemini might reject some mimetypes like docx directly in inlineData, but it generally accepts pdf and plain text.
  // We'll pass it through, but if it fails, it might be due to an unsupported mime type by Gemini File API.
  if (mimeType === 'application/msword' || mimeType.includes('wordprocessingml')) {
     mimeType = 'text/plain'; // Attempt fallback, though buffer is binary. It's better to tell user to use PDF/TXT.
  }
  return {
    inlineData: {
      data: file.buffer.toString('base64'),
      mimeType: mimeType
    },
  };
};

const analyzeSyllabus = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!process.env.GEMINI_API_KEY) {
       return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const filePart = fileToGenerativePart(req.file);

    const prompt = `
      You are an expert academic AI study planner. I will provide you with a syllabus or a study document. 
      Your task is to analyze it and output a strict JSON structure containing two arrays: 'syllabusUnits' and 'syllabusRoadmap'.
      
      Here is the exact JSON structure and schema you MUST follow (do NOT output any markdown, just raw JSON):
      {
        "syllabusUnits": [
          {
            "id": 1,
            "label": "Unit 1: <Name of Unit>",
            "count": "<Number> topics",
            "topics": [
              {
                "name": "<Topic Name>",
                "level": "<HIGH|MEDIUM|LOW>",
                "color": "<Hex Code (e.g., #ef4444 for HIGH, #eab308 for MEDIUM, #22c55e for LOW)>",
                "bg": "<Rgba string matching the color with 0.2 opacity>",
                "time": "~<Number> hrs"
              }
            ]
          }
        ],
        "syllabusRoadmap": [
          {
            "weeks": "Week 1 - 2",
            "title": "Unit 1: <Name of Unit>",
            "desc": "<Brief summary of topics covered>",
            "active": <true or false>
          }
        ],
        "insights": {
          "weightage": {
            "confidence": "<Number>%",
            "coreLogic": "<Number>%",
            "application": "<Number>%",
            "theory": "<Number>%"
          },
          "criticalFocus": {
            "trends": ["<Trend 1>", "<Trend 2>"],
            "resourceTitle": "<Name of a relevant masterclass or resource>"
          },
          "weeklyCommitment": {
            "hours": "<Current>h / <Total>h",
            "progressPercent": "<Number>%",
            "days": [<Boolean array of 7 items representing active study days, e.g., [true, true, true, false, true, true, true]>]
          }
        }
      }
      
      Instructions:
      1. Analyze the attached document and extract the main units/chapters.
      2. For each unit, extract the key topics. Assign a difficulty/importance 'level' (HIGH, MEDIUM, LOW) and estimated study 'time'.
      3. Generate a logical study roadmap distributing the units across several weeks. Mark the first unit as active: true, and others as false.
      4. Generate custom 'insights' based on the complexity and nature of the syllabus text. Calculate sensible weightage percentages, identify two critical focus trends, recommend a mock resource title, and propose a sensible weekly commitment.
      5. ONLY output valid JSON.
    `;

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    let text = response.text();

    // Robust JSON extraction
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    const parsedData = JSON.parse(text);

    res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error analyzing syllabus:', error);
    res.status(500).json({ error: 'Gemini Error: ' + error.message, details: error.stack });
  }
};

module.exports = {
  analyzeSyllabus
};
