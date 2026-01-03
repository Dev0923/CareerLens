# 🔄 CareerLens - Complete Process Flow

## 📋 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CareerLens Platform                         │
│                    AI-Powered Resume Analyzer                       │
└─────────────────────────────────────────────────────────────────────┘
         │
         ├─── Frontend (React + Vite)
         ├─── Backend (Node.js + Express)
         ├─── AI Layer (Google Gemini 2.5-Flash)
         └─── Database (Firebase Firestore)
```

---

## 🌊 Complete User Flow

### **Phase 1: Authentication & Entry**

```
┌─────────────┐
│   START     │
│  (Landing)  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│   User Not Authenticated?       │
│   Display AnimatedLogin Page    │
└────────────┬────────────────────┘
             │
     ┌───────┴───────┐
     │               │
     ▼               ▼
┌────────┐      ┌──────────┐
│ SIGNUP │      │  LOGIN   │
└───┬────┘      └────┬─────┘
    │                │
    ▼                ▼
┌─────────────────────────────┐
│  POST /api/auth/signup      │
│  - Validate username/email  │
│  - Hash password (bcrypt)   │
│  - Store in Firestore       │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│  POST /api/auth/login       │
│  - Verify credentials       │
│  - Compare hashed password  │
│  - Return user object       │
└─────────────┬───────────────┘
              │
              ├──────────────────────────┐
              │                          │
              ▼                          ▼
    ┌───────────────┐         ┌─────────────────────┐
    │  Local Auth   │         │  Google OAuth       │
    │  (Username +  │         │  POST /api/auth/    │
    │   Password)   │         │  google             │
    └───────┬───────┘         │  - Verify ID token  │
            │                 │  - Get user info    │
            │                 │  - Upsert to DB     │
            │                 └──────────┬──────────┘
            │                            │
            └────────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │  User Object     │
              │  - username      │
              │  - name          │
              │  - email         │
              │  - avatar        │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  Set User State  │
              │  in React App    │
              └────────┬─────────┘
                       │
                       ▼
```

---

### **Phase 2: Dashboard & Navigation**

```
┌─────────────────────────────────────────┐
│         DASHBOARD (Main Hub)            │
│  - Welcome message with user name       │
│  - Activity statistics                  │
│  - Feature cards with navigation        │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┼──────────┬──────────┐
    │          │          │          │
    ▼          ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌─────────┐
│   HR   │ │ Skill  │ │Career  │ │ Profile │
│ Review │ │  Gap   │ │Roadmap │ │  Mgmt   │
└────────┘ └────────┘ └────────┘ └─────────┘
```

---

### **Phase 3: Resume Analysis Flow (HR & ATS)**

```
┌────────────────────────────────────────────────────────┐
│          HR REVIEW & ATS ANALYSIS                      │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Step 1: Upload PDF  │
        │  - Browse file       │
        │  - Select resume.pdf │
        └──────────┬───────────┘
                   │
                   ▼
        ┌─────────────────────────────────┐
        │  POST /api/analyze/extract-pdf  │
        │  - Receive file upload          │
        │  - Use multer middleware        │
        │  - Read PDF with pdf-parse      │
        │  - Extract text content         │
        │  - Validate text length         │
        │  - Truncate if > 30,000 chars   │
        └──────────┬──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Resume Text         │
        │  Stored in State     │
        │  (resumeText)        │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Step 2: Enter Job    │
        │ Description          │
        │ (Textarea input)     │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Step 3: Select Mode  │
        │  ○ HR Review         │
        │  ○ ATS Analysis      │
        └──────────┬───────────┘
                   │
                   ▼
        ┌─────────────────────────────┐
        │  POST /api/analyze/run      │
        │  Body: {                    │
        │    jobDescription,          │
        │    resumeText,              │
        │    mode: 'hr' or 'ats'      │
        │  }                          │
        └──────────┬──────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────┐
        │  Backend Controller              │
        │  (analyzeController.js)          │
        └──────────┬───────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────┐
        │  Initialize Google Gemini AI     │
        │  - GoogleGenerativeAI client     │
        │  - Model: gemini-2.5-flash       │
        └──────────┬───────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────┐
        │  Select Prompt Template          │
        │  - HR_PROMPT (if mode='hr')      │
        │  - ATS_PROMPT (if mode='ats')    │
        └──────────┬───────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────┐
        │  Build Full Prompt               │
        │  [Prompt Template]               │
        │  === JOB DESCRIPTION ===         │
        │  [User's job description]        │
        │  === RESUME TEXT ===             │
        │  [Extracted resume text]         │
        └──────────┬───────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────┐
        │  Call Gemini API                 │
        │  model.generateContent(prompt)   │
        │  - Processing time: 5-15 seconds │
        └──────────┬───────────────────────┘
                   │
    ┌──────────────┴──────────────┐
    │                             │
    ▼                             ▼
┌────────────┐            ┌──────────────┐
│ HR REVIEW  │            │ ATS ANALYSIS │
│ OUTPUT     │            │ OUTPUT       │
└─────┬──────┘            └──────┬───────┘
      │                          │
      ▼                          ▼
┌─────────────────────┐  ┌──────────────────────┐
│ 🧑‍💼 HR Summary    │  │ 📊 ATS Scorecard    │
│ - Candidate name   │  │ - Overall score     │
│ - Star rating      │  │ - Vertical graphs   │
│ - Strengths        │  │   🟩🟨🟥 blocks     │
│ - Gaps             │  │ - Keyword analysis  │
│ - Recommendations  │  │ - Missing keywords  │
│ - Interview focus  │  │ - Optimization tips │
└─────────┬───────────┘  └──────┬───────────────┘
          │                     │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │  Display Results    │
          │  - Formatted output │
          │  - Download PDF     │
          │  - Track activity   │
          └─────────────────────┘
```

---

### **Phase 4: Skill Gap Analysis Flow**

```
┌────────────────────────────────────────────┐
│        SKILL GAP ANALYZER                  │
└──────────────┬─────────────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Step 1: Upload PDF   │
    │ (Same as HR flow)    │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────────┐
    │ POST /api/analyze/       │
    │ extract-pdf              │
    │ - Extract resume text    │
    └──────────┬───────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │ Step 2: Input Details    │
    │ - Target Job Role        │
    │ - Experience Level       │
    └──────────┬───────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ POST /api/analyze/skill-gap  │
    │ Body: {                      │
    │   resumeText,                │
    │   jobRole,                   │
    │   experienceLevel            │
    │ }                            │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Backend Controller           │
    │ - Use SKILL_GAP_PROMPT       │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Gemini AI Processing         │
    │ - Extract current skills     │
    │ - Identify industry std      │
    │ - Calculate gaps             │
    │ - Estimate salary impact     │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Return JSON Response         │
    │ {                            │
    │   currentProfile: {...},     │
    │   skillsAnalysis: {...},     │
    │   skillGapDetails: [...],    │
    │   salaryProjection: {...}    │
    │ }                            │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Parse & Display Results      │
    │ - Current salary estimate    │
    │ - Matching skills (✅)       │
    │ - Missing skills (❌)        │
    │ - Partial skills (⚠️)       │
    │ - Impact per skill           │
    │ - Projected salary           │
    │ - Hiring improvement tips    │
    └──────────────────────────────┘
```

---

### **Phase 5: Career Roadmap Generator Flow**

```
┌────────────────────────────────────────────┐
│       CAREER ROADMAP GENERATOR             │
└──────────────┬─────────────────────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │ Input Form               │
    │ - Target Job Role        │
    │ - Area of Interest       │
    │ - Experience Level       │
    │ - Duration (months)      │
    │ - Update Frequency       │
    │   (weekly/monthly)       │
    └──────────┬───────────────┘
               │
               ▼
    ┌─────────────────────────────────┐
    │ POST /api/analyze/              │
    │ career-roadmap                  │
    │ Body: {                         │
    │   jobRole,                      │
    │   interestArea,                 │
    │   experienceLevel,              │
    │   duration,                     │
    │   frequency                     │
    │ }                               │
    └──────────┬──────────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Backend Controller           │
    │ - Use CAREER_ROADMAP_PROMPT  │
    │ - Replace placeholders       │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Gemini AI Processing         │
    │ - Analyze target role        │
    │ - Create phased roadmap      │
    │ - Assign skills per phase    │
    │ - Suggest projects           │
    │ - Estimate milestones        │
    │ - Calculate salary ranges    │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Return JSON Roadmap          │
    │ {                            │
    │   roadmapTitle,              │
    │   roadmapTheme,              │
    │   duration,                  │
    │   frequency,                 │
    │   phases: [                  │
    │     {                        │
    │       phase,                 │
    │       skillsToLearn,         │
    │       projectsToBuild,       │
    │       outcome,               │
    │       salaryMilestone        │
    │     }, ...                   │
    │   ],                         │
    │   finalOutcome,              │
    │   disclaimer                 │
    │ }                            │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Display Interactive Roadmap  │
    │ - Timeline visualization     │
    │ - Phase cards with details   │
    │ - Skills checklist           │
    │ - Project suggestions        │
    │ - Salary progression chart   │
    │ - Download PDF option        │
    └──────────────────────────────┘
```

---

### **Phase 6: Profile Management Flow**

```
┌────────────────────────────────────┐
│       PROFILE MANAGEMENT           │
└──────────────┬─────────────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │ POST /api/auth/          │
    │ get-profile              │
    │ - Fetch user data        │
    └──────────┬───────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │ Display Profile Form     │
    │ - Name                   │
    │ - Email                  │
    │ - Phone                  │
    │ - Bio                    │
    │ - Target Role            │
    │ - Experience             │
    │ - Location               │
    │ - LinkedIn               │
    │ - GitHub                 │
    └──────────┬───────────────┘
               │
    ┌──────────┴────────────┐
    │                       │
    ▼                       ▼
┌────────────┐      ┌──────────────┐
│   UPDATE   │      │    DELETE    │
│  PROFILE   │      │   ACCOUNT    │
└─────┬──────┘      └──────┬───────┘
      │                    │
      ▼                    ▼
┌───────────────────┐  ┌──────────────────┐
│ POST /api/auth/   │  │ POST /api/auth/  │
│ update-profile    │  │ delete-account   │
│ - Update fields   │  │ - Remove from DB │
│ - Save to DB      │  │ - Logout user    │
└─────┬─────────────┘  └──────┬───────────┘
      │                       │
      ▼                       ▼
┌───────────────┐      ┌──────────────┐
│ Success msg   │      │ Redirect to  │
│ Profile saved │      │ Login page   │
└───────────────┘      └──────────────┘
```

---

## 🗄️ Database Structure (Firestore)

```
firestore/
└── users/
    └── {username}/
        ├── username: string
        ├── name: string
        ├── email: string
        ├── password: string (hashed)
        ├── provider: 'local' | 'google'
        ├── subject: string (OAuth ID)
        ├── avatar: string (URL)
        ├── phone: string
        ├── bio: string
        ├── targetRole: string
        ├── experience: string
        ├── location: string
        ├── linkedin: string
        ├── github: string
        ├── createdAt: timestamp
        └── updatedAt: timestamp
```

---

## 🔗 API Endpoints Summary

### **Authentication Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new user account |
| POST | `/api/auth/login` | Login with username/password |
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/get-profile` | Fetch user profile |
| POST | `/api/auth/update-profile` | Update user profile |
| POST | `/api/auth/delete-account` | Delete user account |

### **Analysis Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze/extract-pdf` | Extract text from resume PDF |
| POST | `/api/analyze/run` | HR or ATS analysis |
| POST | `/api/analyze/skill-gap` | Skill gap analysis |
| POST | `/api/analyze/career-roadmap` | Generate career roadmap |

### **Health Check**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

---

## 🤖 AI Processing Pipeline

```
┌─────────────────────────────────────────────────────┐
│              GEMINI AI PROCESSING                   │
└──────────────────┬──────────────────────────────────┘
                   │
     ┌─────────────┼─────────────┬─────────────┐
     │             │             │             │
     ▼             ▼             ▼             ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│    HR    │ │   ATS    │ │  Skill   │ │  Career  │
│  PROMPT  │ │  PROMPT  │ │   Gap    │ │ Roadmap  │
│          │ │          │ │  PROMPT  │ │  PROMPT  │
└────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │            │
     │            │            │            │
     └────────────┴────────────┴────────────┘
                  │
                  ▼
     ┌────────────────────────┐
     │  Gemini 2.5-Flash API  │
     │  - Temperature: 0.7    │
     │  - Max tokens: 8192    │
     │  - Response time: 5-15s│
     └────────────┬───────────┘
                  │
                  ▼
     ┌────────────────────────┐
     │   Parse Response       │
     │   - Clean markdown     │
     │   - Extract JSON       │
     │   - Validate format    │
     └────────────┬───────────┘
                  │
                  ▼
     ┌────────────────────────┐
     │   Return to Frontend   │
     └────────────────────────┘
```

---

## 📤 Output Formats

### **1. HR Review Output**
```
🧑‍💼 HR Review Summary – [Name]
Target Role: [Role]
Overall Fit: ⭐⭐⭐⭐⭐

🔍 Executive Snapshot
[Overview paragraph]

💪 Core Strengths
🚀 Revenue & Sales Excellence
• Achievement 1
• Achievement 2
Impact: [Statement]

⚠️ Potential Gaps
[Gaps and recommendations]

✅ Final Recommendation
[Decision and reasoning]
```

### **2. ATS Analysis Output**
```
📊 ATS Compatibility Scorecard

🎯 Overall ATS Score
95 / 100 — Excellent Match

ATS SCORE                    95%
 100 ┤
  90 ┤ 🟩
  80 ┤ 🟩
  70 ┤ 🟩
  ...

🔑 Keyword Match Analysis
[Matched and missing keywords]

📈 ATS Success Probability
[Recommendations]
```

### **3. Skill Gap Analysis Output**
```json
{
  "currentProfile": {
    "estimatedCurrentSalary": "₹8-12 LPA",
    "overallProfileStrength": "Medium"
  },
  "skillsAnalysis": {
    "matchingSkills": ["skill1", "skill2"],
    "missingSkills": ["skill3", "skill4"],
    "partialSkills": ["skill5"]
  },
  "skillGapDetails": [
    {
      "skill": "Docker",
      "importance": "Essential for deployment",
      "hiringImpact": "Increases chances by 30%",
      "estimatedSalaryIncreasePercent": "10-15"
    }
  ],
  "salaryProjection": {
    "projectedSalaryRange": "₹12-18 LPA",
    "estimatedTotalHikePercent": "40"
  }
}
```

### **4. Career Roadmap Output**
```json
{
  "roadmapTitle": "Full-Stack Developer Journey",
  "roadmapTheme": "Game Levels",
  "duration": "6 months",
  "frequency": "monthly updates",
  "phases": [
    {
      "phase": "Month 1 - Foundation",
      "skillsToLearn": ["HTML", "CSS", "JavaScript"],
      "projectsToBuild": ["Portfolio website", "Todo app"],
      "outcome": "Build responsive web pages",
      "salaryMilestone": "₹3-5 LPA"
    }
  ],
  "finalOutcome": {
    "careerReadiness": "Job-ready with portfolio",
    "confidenceLevel": "Intermediate",
    "estimatedFinalSalaryRange": "₹8-12 LPA"
  }
}
```

---

## 🎨 Frontend Component Flow

```
App.jsx (Root)
├── AnimatedLogin.jsx (if not authenticated)
│   ├── Login form
│   ├── Signup form
│   └── Google OAuth button
│
└── Authenticated Layout
    ├── Header.jsx
    │   ├── Logo
    │   ├── Navigation tabs
    │   └── User menu
    │
    ├── Main Content (Router)
    │   ├── Dashboard.jsx
    │   │   ├── Welcome section
    │   │   ├── Activity charts
    │   │   ├── Feature cards
    │   │   └── Team section
    │   │
    │   ├── Analyzer.jsx
    │   │   ├── PDF upload
    │   │   ├── Job description input
    │   │   ├── Mode selector (HR/ATS)
    │   │   ├── Results display
    │   │   └── Download button
    │   │
    │   ├── SkillGapAnalyzer.jsx
    │   │   ├── Resume upload
    │   │   ├── Job role input
    │   │   ├── Experience level selector
    │   │   ├── Analysis results
    │   │   └── Salary visualization
    │   │
    │   ├── CareerRoadmapGenerator.jsx
    │   │   ├── Input form
    │   │   ├── Roadmap visualization
    │   │   ├── Phase cards
    │   │   └── Download option
    │   │
    │   └── Profile.jsx
    │       ├── Profile form
    │       ├── Update button
    │       └── Delete account option
    │
    └── Footer.jsx
        └── Copyright & credits
```

---

## 🔐 Security Features

```
┌────────────────────────────────────┐
│        SECURITY LAYERS             │
└──────────────┬─────────────────────┘
               │
    ┌──────────┼──────────┬──────────┐
    │          │          │          │
    ▼          ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Bcrypt │ │ OAuth  │ │  CORS  │ │ Input  │
│Password│ │ 2.0    │ │ Policy │ │Validate│
│Hashing │ │ Google │ │        │ │        │
└────────┘ └────────┘ └────────┘ └────────┘
```

**Security Implementations:**
1. **Password Hashing**: bcrypt with salt rounds
2. **OAuth 2.0**: Google authentication
3. **CORS**: Configured allowed origins
4. **Input Validation**: Server-side checks
5. **File Upload**: Size limits and type validation
6. **Environment Variables**: Sensitive data protection
7. **Firestore Rules**: Database access control

---

## 📊 Data Flow Diagram

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│          │         │          │         │          │
│  CLIENT  │────────▶│  SERVER  │────────▶│ GEMINI   │
│ (React)  │         │ (Express)│         │   API    │
│          │◀────────│          │◀────────│          │
└────┬─────┘         └─────┬────┘         └──────────┘
     │                     │
     │                     │
     ▼                     ▼
┌──────────┐         ┌──────────┐
│          │         │          │
│ LocalSt. │         │Firestore │
│ (temp)   │         │ Database │
│          │         │          │
└──────────┘         └──────────┘
```

---

## ⚡ Performance Optimization

### **Frontend**
- ✅ React lazy loading
- ✅ Component memoization
- ✅ Optimized re-renders
- ✅ Asset compression (Vite)

### **Backend**
- ✅ Connection pooling (Firestore)
- ✅ Response caching strategies
- ✅ File size limits (2MB)
- ✅ Text truncation (30,000 chars)

### **AI Processing**
- ✅ Prompt optimization
- ✅ Response parsing
- ✅ Error handling with retry logic
- ✅ Timeout management

---

## 🚀 Deployment Flow

```
┌─────────────┐
│   GitHub    │
│ Repository  │
└──────┬──────┘
       │ (git push)
       │
       ▼
┌─────────────────────────────┐
│      Render Platform        │
│  ┌─────────────────────┐   │
│  │   Backend Service   │   │
│  │  - Auto deploy      │   │
│  │  - Build: npm i     │   │
│  │  - Start: npm start │   │
│  └──────────┬──────────┘   │
│             │               │
│  ┌──────────▼──────────┐   │
│  │   Frontend Static   │   │
│  │  - Build: npm build │   │
│  │  - Serve: dist/     │   │
│  └─────────────────────┘   │
└─────────────────────────────┘
       │
       ▼
┌─────────────────┐
│   Live URLs     │
│  - Backend API  │
│  - Frontend App │
└─────────────────┘
```

---

## 🧪 Error Handling

```
┌────────────────────────────────────┐
│        ERROR HANDLING FLOW         │
└──────────────┬─────────────────────┘
               │
    ┌──────────┼──────────┬──────────┐
    │          │          │          │
    ▼          ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Client │ │ Server │ │   AI   │ │   DB   │
│ Errors │ │ Errors │ │ Errors │ │ Errors │
└───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
    │          │          │          │
    └──────────┴──────────┴──────────┘
               │
               ▼
    ┌──────────────────────┐
    │  User-Friendly       │
    │  Error Messages      │
    │  - ⚠️ Warnings       │
    │  - ❌ Errors         │
    │  - 💡 Suggestions    │
    └──────────────────────┘
```

---

## 📈 Activity Tracking

```
┌────────────────────────────────────┐
│      ACTIVITY TRACKER              │
│  (activityTracker.js)              │
└──────────────┬─────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Track Events:       │
    │  - Resume analysis   │
    │  - ATS score         │
    │  - Skill gap check   │
    │  - Roadmap creation  │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Store in            │
    │  localStorage        │
    │  {                   │
    │    totalAnalyses,    │
    │    avgAtsScore,      │
    │    lastActivity      │
    │  }                   │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Display on          │
    │  Dashboard           │
    │  - Statistics        │
    │  - Charts            │
    │  - Insights          │
    └──────────────────────┘
```

---

## 🎯 End-to-End Example Flow

**Scenario: User uploads resume for HR Review**

1. **User Authentication**
   - User logs in → JWT validation → Dashboard

2. **Navigate to HR Review**
   - Click "HR Review" card → Analyzer component loads

3. **Upload Resume**
   - Select PDF file → Auto-extracts text → Shows success

4. **Enter Job Description**
   - Paste job posting → Validation → Enable analyze button

5. **Run Analysis**
   - Click "HR Review" → Loading spinner → API call

6. **Backend Processing**
   - Receive request → Extract data → Build prompt
   - Call Gemini API → Parse response → Return JSON

7. **Display Results**
   - Show formatted output → Enable download
   - Track activity → Update dashboard stats

8. **User Actions**
   - Download PDF report
   - Share or save results
   - Navigate to other features

---

## ✅ Complete Feature List

### **Core Features**
- ✅ User authentication (Local + Google OAuth)
- ✅ Resume PDF upload & text extraction
- ✅ HR review analysis
- ✅ ATS compatibility scoring
- ✅ Skill gap analysis with salary insights
- ✅ Career roadmap generation
- ✅ Profile management
- ✅ Activity tracking
- ✅ PDF report download
- ✅ Responsive design

### **Technical Stack**
- ✅ Frontend: React + Vite + CSS Modules
- ✅ Backend: Node.js + Express
- ✅ Database: Firebase Firestore
- ✅ AI: Google Gemini 2.5-Flash
- ✅ Auth: Google OAuth 2.0 + bcrypt
- ✅ Deployment: Render (Backend + Frontend)

---

## 🔄 Summary

This CareerLens platform provides a complete end-to-end solution for resume analysis, career planning, and skill development. The process flow ensures:

1. **Secure Authentication** - Multiple login options
2. **Intelligent Analysis** - AI-powered insights
3. **Actionable Results** - Clear recommendations
4. **User-Friendly Interface** - Intuitive navigation
5. **Scalable Architecture** - Cloud-native deployment
6. **Real-time Processing** - Fast API responses
7. **Data Persistence** - Firestore integration
8. **Activity Tracking** - User engagement metrics

**Total Processing Time:**
- Authentication: < 1 second
- PDF extraction: 2-5 seconds
- AI analysis: 5-15 seconds
- Data storage: < 1 second

**End Result:** Complete career insights in under 20 seconds! 🚀
