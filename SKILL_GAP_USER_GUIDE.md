# Skill Gap Analysis - Quick Start Guide

## What It Does
Analyzes your resume against a target job role and tells you:
- What skills you have that match the role
- What skills are missing
- How much your salary could increase by learning each missing skill
- Your projected salary after acquiring all gap skills

## How to Use

### Step 1: Upload Resume
1. Click "Choose File" and select your resume PDF
2. Click "Extract Text" button
3. Wait for confirmation message (text extracted successfully)

### Step 2: Start Skill Gap Analysis
1. Click the blue "🎯 Skill Gap Analysis" button
2. You'll see a form for job role and experience level

### Step 3: Enter Details
**Required:**
- **Target Job Role:** Type the exact role you want to target
  - Examples: "Senior React Developer", "Product Manager", "Data Scientist"
  - Be specific for better results!

**Optional:**
- **Experience Level:** Select your career stage
  - Fresher (0-1 years)
  - Junior (1-3 years)
  - Mid-level (3-5 years)
  - Senior (5-8 years)
  - Lead/Manager (8+ years)

### Step 4: Get Analysis
1. Click "🔍 Analyze Skills"
2. Wait for AI analysis (30-60 seconds)
3. Results will appear automatically

## Understanding Results

### 📊 Current Profile
- **Estimated Salary:** Your current expected salary range in LPA (Lakhs Per Annum)
- **Profile Strength:** Low | Medium | High (based on resume content)

### 💡 Skills Analysis
- **✓ Matching Skills:** What you already have (Green)
- **✗ Missing Skills:** What you need to learn (Red)
- **⚠️ Partial Skills:** What you know but need to improve (Yellow)

### 📈 Skill Gap Details
For each missing/weak skill, you'll see:
- **Importance:** Why this skill matters for the role
- **Hiring Impact:** How learning this improves your chances
- **Salary Impact:** Estimated % increase if you learn this skill

### 💰 Salary Projection
- **Projected Salary Range:** Expected salary after learning all gap skills
- **Total Hike %:** Total potential salary increase (sum of all skill impacts)

## Example Analysis

**Input:**
- Resume: 3 years of experience with Python, JavaScript
- Target Role: "Senior React Developer"
- Experience Level: Mid-level (3-5 years)

**Output:**
```
Current Profile:
  - Estimated Salary: ₹15-20 LPA
  - Strength: Medium

Skills Analysis:
  ✓ Matching: JavaScript, React, Node.js, Git
  ✗ Missing: TypeScript, Testing (Jest), GraphQL, DevOps
  ⚠️ Partial: System Design, Architecture

Skill Gap Details:
  1. TypeScript (15% salary increase)
     - Importance: Industry standard for production React
     - Hiring Impact: 90% of senior roles require it
  
  2. GraphQL (12% salary increase)
     - Importance: Modern API standard
     - Hiring Impact: Differentiates you from candidates

Salary Projection:
  - After Skills: ₹19-25 LPA
  - Total Hike: +20%
```

## Tips for Best Results

✅ **Use Complete Job Descriptions**
- Paste the entire job posting for accurate skill matching
- Include required & nice-to-have skills sections

✅ **Be Specific About Job Role**
- "React Developer" is less specific than "Senior React Developer"
- Include the seniority level if possible

✅ **Update Resume Regularly**
- Make sure resume includes all your actual skills
- List technologies with versions/years of experience

✅ **Realistic Salary Expectations**
- Salary estimates are based on market averages
- Actual salary depends on company, location, negotiation
- These are estimates, not guarantees

## Download Your Report

After analysis:
1. Click "⬇️ Download Report" button
2. Text file saves to your computer
3. Share with mentors or use for reference

## Analyze Another Role

- Click "🔄 Analyze Another Role" to test a different job position
- Compare skill gaps across multiple roles
- Find which role suits you best

## Go Back to Main Menu

- Click "← Back to Menu" to return to HR/ATS analysis
- Or upload a different resume

## Common Questions

**Q: Why is my salary estimate different from job postings?**
A: We provide market averages based on typical range for your profile. Actual salary depends on many factors (location, company, negotiation, etc.)

**Q: Are these estimates guaranteed?**
A: No. Salary estimates are projections based on market trends and may vary significantly. See disclaimer at bottom of results.

**Q: Can I learn all missing skills?**
A: Yes! But prioritize by:
1. Importance to the role
2. Hiring impact (what employers value most)
3. Learning difficulty (start with easier skills)
4. Your learning capacity (don't try to learn 10 skills at once!)

**Q: How accurate is this?**
A: It's based on real market data and industry trends, but remember:
- Job market changes frequently
- Location matters (salary ranges vary by city/country)
- Individual negotiations can differ significantly
- Your unique background affects outcomes

**Q: How do I improve my profile?**
A: Focus on skills with highest impact:
1. Check "Hiring Impact" column
2. Prioritize skills mentioned in "Importance"
3. Learn through courses, projects, practice
4. Update resume once learned
5. Re-analyze to track progress

## Need Help?

1. **Resume extraction issues?** Make sure it's a text-based PDF (not scanned image)
2. **API errors?** Check that GOOGLE_API_KEY is set in your `.env` file
3. **Unexpected results?** Try with more specific job role details

---

**Version:** 1.0
**Last Updated:** December 29, 2025
**Powered by:** Gemini AI + GDG Resume Analyzer
