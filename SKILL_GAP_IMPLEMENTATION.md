# Skill Gap Analysis Feature - Implementation Guide

## Overview
The skill gap analysis feature analyzes a user's resume against a target job role to:
- Extract current technical and professional skills
- Identify industry-required skills
- Highlight missing and weak skills
- Estimate salary impact for each missing skill
- Project salary range after skill acquisition

## Implementation Details

### 1. Backend Changes

#### **File: `server/src/prompts.js`**
Added `SKILL_GAP_PROMPT` - a comprehensive system prompt that guides Gemini AI to:
- Perform realistic skill gap analysis
- Provide market-based salary estimates
- Use Indian LPA (Lakhs Per Annum) context
- Output structured JSON response

**Key features:**
- Strict JSON-only output (no markdown)
- Market-based salary impact estimation (5-20% typical range)
- Realistic, ethical analysis without guaranteed claims
- Professional tone suitable for HR/career decisions

#### **File: `server/src/controllers/analyzeController.js`**
Added new `skillGap` method that:
1. Validates input (resumeText and jobRole required)
2. Constructs prompt with resume, target role, and optional experience level
3. Calls Gemini API with skill gap prompt
4. Handles and removes markdown formatting from JSON response
5. Returns parsed JSON analysis

**Error handling:**
- Validates required parameters
- Catches API errors (quota, invalid key, model not found)
- Handles JSON parsing errors gracefully

#### **File: `server/src/routes/analyze.js`**
Added new route:
```javascript
router.post('/skill-gap', AnalyzeController.skillGap);
```

### 2. Frontend Changes

#### **File: `client/src/components/SkillGapAnalyzer.jsx`** (NEW)
A comprehensive React component that:
- Accepts target job role and experience level inputs
- Displays current profile strength and estimated salary
- Shows skill analysis (matching, missing, partial skills)
- Lists skill gap details with hiring impact and salary impact
- Projects salary range after skill acquisition
- Generates downloadable text reports

**User Experience:**
- Clean, intuitive form for job role and experience level
- Color-coded skill categories (green=matching, red=missing, yellow=partial)
- Detailed card layout for each skill gap with impact explanation
- Professional salary projection display
- One-click report download

#### **File: `client/src/components/Analyzer.jsx`**
Updated to integrate skill gap analyzer:
- Added `showSkillGap` state
- New button "🎯 Skill Gap Analysis" (shown when resume is uploaded)
- Conditional rendering of SkillGapAnalyzer component
- Sidebar visibility toggle based on current view

### 3. API Endpoint

**POST `/api/analyze/skill-gap`**

**Request Body:**
```json
{
  "resumeText": "string (extracted resume content)",
  "jobRole": "string (target job role, e.g., 'Senior React Developer')",
  "experienceLevel": "string (optional, e.g., 'Senior (5-8 years)')"
}
```

**Response (Success):**
```json
{
  "ok": true,
  "analysis": {
    "currentProfile": {
      "estimatedCurrentSalary": "₹X – ₹Y LPA",
      "overallProfileStrength": "Low | Medium | High"
    },
    "skillsAnalysis": {
      "matchingSkills": ["skill1", "skill2"],
      "missingSkills": ["skill1", "skill2"],
      "partialSkills": ["skill1", "skill2"]
    },
    "skillGapDetails": [
      {
        "skill": "skill name",
        "importance": "why this skill matters",
        "hiringImpact": "how this improves hiring chances",
        "estimatedSalaryIncreasePercent": "number"
      }
    ],
    "salaryProjection": {
      "projectedSalaryRange": "₹X – ₹Y LPA",
      "estimatedTotalHikePercent": "number"
    },
    "disclaimer": "salary values are estimates based on market trends..."
  }
}
```

**Response (Error):**
```json
{
  "ok": false,
  "error": "⚠️ Error message"
}
```

## Usage

### For Users:
1. Upload and extract resume text
2. Click "🎯 Skill Gap Analysis" button
3. Enter target job role (e.g., "Product Manager", "Full Stack Developer")
4. Optionally select experience level for better salary estimates
5. Click "🔍 Analyze Skills"
6. Review:
   - Current profile strength and salary
   - Matching/missing/partial skills
   - Detailed gap analysis with hiring impact
   - Projected salary after skill acquisition
7. Download report as text file

### Example Inputs:
- **Job Role:** "Senior React Developer"
- **Experience Level:** "Mid-level (3-5 years)"

### Example Output Flow:
```
Current Profile → Estimated ₹12-18 LPA, Medium Strength
                ↓
Skills Analysis → 8 matching, 4 missing, 2 partial
                ↓
Gap Details → Node.js (15% salary impact), Docker (12%), etc.
                ↓
Projection → ₹15-22 LPA after acquiring missing skills (+20% total)
```

## Technical Architecture

### Gemini Integration:
- Uses existing `GoogleGenerativeAI` client from `server/src/index.js`
- Leverages `gemini-2.5-flash` model for fast, accurate analysis
- Handles API rate limits and errors gracefully

### Data Flow:
```
User Input (jobRole, resumeText)
         ↓
Backend Validation
         ↓
Gemini API Call (with SKILL_GAP_PROMPT)
         ↓
JSON Response Parsing
         ↓
Frontend Rendering
         ↓
User-friendly Display + Download Option
```

### JSON Output Format:
The Gemini API is prompted to output STRICT JSON with no markdown, ensuring:
- Easy parsing in frontend
- No manual formatting needed
- Consistent structure across all analyses

## Key Features

✅ **Realistic Salary Estimates** - Market-based, not guaranteed
✅ **Skill Prioritization** - Lists by importance and impact
✅ **Experience-Level Aware** - Adjusts estimates based on career stage
✅ **Hiring Impact Analysis** - Explains how skills improve job selection
✅ **Downloadable Reports** - Structured text format for sharing
✅ **No Guarantees** - Includes professional disclaimer
✅ **Indian Market Context** - Uses LPA (Lakhs Per Annum)

## Error Handling

The implementation includes comprehensive error handling:
1. **Validation**: Checks for required inputs before API call
2. **API Errors**: Catches and translates Gemini API errors to user-friendly messages
3. **JSON Parsing**: Handles malformed responses with descriptive errors
4. **Network Errors**: Gracefully catches fetch/network issues

## Environment Variables Required
The feature uses the same Gemini API key configured for the app:
- `GOOGLE_API_KEY` (must be set in `.env` file)

## Integration Notes

- ✅ Uses existing Gemini API client (no new credentials needed)
- ✅ Doesn't modify existing ATS or HR analysis logic
- ✅ Follows existing code structure and patterns
- ✅ Maintains same error handling style
- ✅ Compatible with existing frontend styling

## Testing the Feature

### Manual Testing:
1. Upload a resume
2. Click "🎯 Skill Gap Analysis"
3. Enter a job role: "Data Scientist", "Frontend Developer", etc.
4. Select experience level (optional)
5. Review the structured analysis

### Test Cases:
- Fresher with basic skills → Low profile strength, high salary improvement potential
- Senior developer with many skills → High profile strength, focused gap analysis
- Career changer → Highlight transferable skills and new skill gaps

## Future Enhancements

Possible additions:
- Learning path recommendations (courses, timelines)
- Skill dependency mapping (prerequisite skills)
- Industry benchmark comparison
- Skill trend analysis (emerging vs declining skills)
- Multiple role comparison (compare salary/gaps across roles)
- Export to PDF with charts/visualizations
- Integration with learning platforms (Coursera, LinkedIn Learning)

---

**Last Updated:** December 29, 2025
**Status:** Production Ready ✅
