import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const analyzeCode = async (fileDiffs) => {
  try {
    const prompt = `
      You are a Senior Code Reviewer. 
      Analyze the following git diffs.
      
      RETURN YOUR RESPONSE AS RAW JSON ONLY. DO NOT USE MARKDOWN BLOCK.
      Structure:
      {
        "status": "safe" | "risk",
        "summary": "Short summary of findings",
        "issues": [
          { "file": "filename", "line": "line number", "description": "issue description", "severity": "high/medium/low", "fix": "suggested fix" }
        ]
      }

      Rules:
      - If code is secure and logical, set "status": "safe" and "issues": [].
      - If there are bugs/security risks, set "status": "risk" and list them.

      Diffs:
      ${JSON.stringify(fileDiffs, null, 2)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Clean the text to ensure it's valid JSON
    let text = response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text); // Return Object, not String

  } catch (error) {
    console.error('AI Analysis Error:', error.message);
    // Fallback if AI fails to give JSON
    return {
      status: 'risk',
      summary: 'AI Analysis failed to parse. Manual review recommended.',
      issues: []
    };
  }
};