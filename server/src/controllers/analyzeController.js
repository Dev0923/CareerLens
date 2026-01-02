import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { HR_PROMPT, ATS_PROMPT, SKILL_GAP_PROMPT } from '../prompts.js';

function mapError(err) {
  const msg = (err?.message || err?.toString() || '').toUpperCase();
  if (msg.includes('429')) return '⚠️ API quota exceeded. Please try again later or add billing to your Google Cloud project.';
  if (msg.includes('400') || msg.includes('INVALID')) return '⚠️ Invalid API key. Please check your .env file and ensure the key is valid.';
  if (msg.includes('404')) return '⚠️ Model not found. The gemini-2.5-flash model may not be available.';
  return `⚠️ API Error: ${msg.slice(0, 200)}`;
}

async function extractTextFromPdfBuffer(buffer) {
  try {
    const data = await pdfParse(buffer);
    let text = (data?.text || '').trim();
    text = text.replace(/\n{3,}/g, '\n\n');
    if (!text || text.length < 100) {
      return { text: null, error: '⚠️ Could not extract text from PDF. This may be a scanned/image-based resume. Please upload a text-based PDF.' };
    }
    const maxLength = 30000;
    if (text.length > maxLength) {
      text = text.slice(0, maxLength) + '\n\n[Resume truncated due to length]';
    }
    return { text, error: null };
  } catch (e) {
    return { text: null, error: `⚠️ Error reading PDF: ${e.message}` };
  }
}

export const AnalyzeController = {
  extract: async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ ok: false, error: 'No file uploaded' });
      const buffer = fs.readFileSync(file.path);
      const { text, error } = await extractTextFromPdfBuffer(buffer);
      fs.unlinkSync(file.path);
      if (error) return res.status(400).json({ ok: false, error });
      return res.json({ ok: true, text, length: text.length });
    } catch (e) {
      return res.status(500).json({ ok: false, error: e.message });
    }
  },

  analyze: async (req, res) => {
    const { jobDescription, resumeText, mode } = req.body || {};
    if (!jobDescription || !resumeText) {
      return res.status(400).json({ ok: false, error: '⚠️ Please provide jobDescription and resumeText' });
    }
    try {
      const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const promptText = mode === 'hr' ? HR_PROMPT : ATS_PROMPT;
      const fullPrompt = `${promptText}\n\n=== JOB DESCRIPTION ===\n${jobDescription}\n\n=== RESUME TEXT ===\n${resumeText}`;
      const response = await model.generateContent(fullPrompt);
      const text = response?.response?.text() || response?.text() || '';
      return res.json({ ok: true, output: text });
    } catch (error) {
      return res.status(500).json({ ok: false, error: mapError(error) });
    }
  },

  skillGap: async (req, res) => {
    const { resumeText, jobRole, experienceLevel } = req.body || {};
    
    if (!resumeText || !jobRole) {
      return res.status(400).json({ 
        ok: false, 
        error: '⚠️ Please provide resumeText and jobRole' 
      });
    }

    try {
      const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const fullPrompt = `${SKILL_GAP_PROMPT}

=== TARGET JOB ROLE ===
${jobRole}

${experienceLevel ? `=== EXPERIENCE LEVEL ===\n${experienceLevel}\n` : ''}
=== RESUME TEXT ===
${resumeText}`;

      const response = await model.generateContent(fullPrompt);
      let text = response?.response?.text() || response?.text() || '';
      
      // Remove markdown code blocks if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Parse JSON response
      let analysisData;
      try {
        analysisData = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError.message);
        console.error('Response text:', text.substring(0, 500));
        return res.status(500).json({ 
          ok: false, 
          error: '⚠️ Error parsing skill gap analysis. Please try again.' 
        });
      }

      return res.json({ ok: true, analysis: analysisData });
    } catch (error) {
      return res.status(500).json({ ok: false, error: mapError(error) });
    }
  },

  careerRoadmap: async (req, res) => {
    try {
      const { jobRole, interestArea, experienceLevel, duration, frequency } = req.body;

      if (!jobRole || !interestArea) {
        return res.status(400).json({ ok: false, error: '⚠️ Job role and interest area are required' });
      }

      const durationNum = duration || 6;
      const expLevel = experienceLevel || 'Beginner';
      const updateFrequency = frequency || 'monthly';

      const { CAREER_ROADMAP_PROMPT } = await import('../prompts.js');
      
      const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const userPrompt = CAREER_ROADMAP_PROMPT
        .replace('{{JOB_ROLE}}', jobRole)
        .replace('{{INTEREST_AREA}}', interestArea)
        .replace('{{EXPERIENCE_LEVEL}}', expLevel)
        .replace('{{DURATION}}', durationNum)
        .replace('{{FREQUENCY}}', updateFrequency);

      const response = await model.generateContent(userPrompt);
      let text = response?.response?.text() || response?.text() || '';
      
      // Remove markdown code blocks if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Parse JSON response
      let roadmapData;
      try {
        roadmapData = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError.message);
        console.error('Response text:', text.substring(0, 500));
        return res.status(500).json({ ok: false, error: '⚠️ Failed to parse roadmap data. Please try again.' });
      }

      return res.json({ ok: true, roadmap: roadmapData });
    } catch (error) {
      return res.status(500).json({ ok: false, error: mapError(error) });
    }
  }};