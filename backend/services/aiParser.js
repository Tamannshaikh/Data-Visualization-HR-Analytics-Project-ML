const fs = require('fs');
const pdfParse = require('pdf-parse');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy-key-to-prevent-crash" });

async function parseResumeAndScore(pdfPath, jobDetails) {
  try {
    // 1. Extract text from PDF
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    // 2. Prompt OpenAI for analysis
    const prompt = `
      You are an expert HR Recruitment AI.
      Job Role: ${jobDetails.role}
      Job Skills Required: ${(jobDetails.skillsRequired || []).join(', ')}
      Job Experience: ${jobDetails.experienceRequired}

      Candidate Resume:
      ${resumeText}

      Analyze the resume against the job requirements.
      Provide a JSON output ONLY with the following structure:
      {
        "score": (a number between 0 and 100 based on match),
        "matchedSkills": [(array of job skills found in resume)],
        "missingSkills": [(array of job skills NOT found in resume)]
      }
    `;

    const hasOpenAI = process.env.OPENAI_API_KEY && 
                     !process.env.OPENAI_API_KEY.includes('your-openai-key-here');

    if (!hasOpenAI) {
       console.log("No valid OPENAI_API_KEY found, simulating AI parsing...");
       // Mock response
       return {
         score: Math.floor(Math.random() * 40) + 50,
         matchedSkills: ["JavaScript", "React"],
         missingSkills: ["Node.js"]
       };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const resultText = response.choices[0].message.content;
    const aiResult = JSON.parse(resultText);

    return {
      score: aiResult.score || 0,
      matchedSkills: aiResult.matchedSkills || [],
      missingSkills: aiResult.missingSkills || []
    };

  } catch (err) {
    console.error("AI Parsing Error:", err);
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: []
    };
  }
}

module.exports = { parseResumeAndScore };
