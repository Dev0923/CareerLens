# 📄 Resume ATS Analyzer

> An AI-powered resume analysis tool that evaluates your resume against job descriptions using Google's Gemini AI. Get insights from both HR and ATS perspectives to optimize your resume for better job matches.

![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)
![Streamlit](https://img.shields.io/badge/Streamlit-1.40+-red.svg)
![Gemini](https://img.shields.io/badge/Gemini-2.5--flash-brightgreen.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 🌟 Features

- **📝 Text-Based PDF Processing** - Extracts text from text-based PDF resumes (no image processing)
- **🤖 AI-Powered Analysis** - Uses Google Gemini 2.5 Flash for intelligent resume evaluation
- **👔 HR Review** - Get feedback from an HR specialist perspective
- **🎯 ATS Scoring** - Detailed ATS compatibility analysis with keyword matching
- **📊 Structured Reports** - Clear, actionable insights with scoring and recommendations
- **⚡ Fast & Free** - No paid APIs, runs on free tier of Google Gemini
- **🎨 Modern UI** - Dark theme with smooth animations and professional design

## 🚀 Demo

![App Screenshot](https://via.placeholder.com/800x400?text=Resume+ATS+Analyzer+Demo)

## 📋 Prerequisites

- Python 3.11 or higher
- Google Gemini API key (free tier available)
- Text-based PDF resumes (scanned/image PDFs not supported)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/gemini-ats-resume-analyzer.git
cd gemini-ats-resume-analyzer
```

### 2. Create virtual environment

```bash
python -m venv .venv
```

### 3. Activate virtual environment

**Windows:**
```bash
.venv\Scripts\activate
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Set up API key

Create a `.env` file in the root directory:

```env
GOOGLE_API_KEY="your_gemini_api_key_here"
```

**Get your free API key:** https://aistudio.google.com/app/apikey

## 🎯 Usage

### Start the application

```bash
streamlit run app.py
```

The app will open in your browser at `http://localhost:8501`

### How to use

1. **Enter Job Description** - Paste the complete job posting in the text area
2. **Upload Resume** - Upload your resume as a text-based PDF
3. **Choose Analysis Type:**
   - **HR Review** - Get comprehensive feedback on strengths, weaknesses, and fit
   - **ATS Match Score** - Get scored analysis with keyword gaps and optimization tips
4. **Download Report** - Save the analysis results for future reference

## 📂 Project Structure

```
gemini-ats-resume-analyzer/
├── app.py                  # Main Streamlit application
├── requirements.txt        # Python dependencies
├── .env                   # Environment variables (API keys)
├── README.md              # Project documentation
├── LICENSE               # MIT License
├── Procfile              # Deployment configuration
└── packages.txt          # System dependencies
```

## 🛠️ Tech Stack

- **Frontend:** Streamlit
- **AI Model:** Google Gemini 2.5 Flash
- **PDF Processing:** pdfplumber
- **Environment:** python-dotenv
- **Language:** Python 3.11+

## ⚙️ Configuration

### API Quota Limits (Free Tier)

- **60 requests per minute**
- **1 million tokens per day**
- Quota resets daily at midnight UTC

### Supported PDF Types

✅ **Supported:**
- Text-based PDFs (created digitally)
- PDFs with selectable text
- Multi-page resumes

❌ **Not Supported:**
- Scanned/image-based PDFs
- PDFs without extractable text
- Encrypted/password-protected PDFs

## 🎨 Features Deep Dive

### HR Review Analysis

Provides comprehensive evaluation including:
- **Strengths** - Key areas where candidate excels
- **Weaknesses** - Gaps and areas for improvement
- **Key Observations** - Overall fit and alignment
- **Recommendation** - Clear hiring decision guidance

### ATS Match Score

Detailed ATS compatibility report:
- **Numerical Score** - X/100 rating based on keyword matching
- **Keyword Analysis** - Matching vs missing keywords
- **Formatting Assessment** - ATS parsing compatibility
- **Optimization Tips** - Actionable improvement suggestions

## 🐛 Troubleshooting

### Common Issues

**"API Key not found" error:**
- Verify `.env` file exists in root directory
- Check API key format (no extra spaces)
- Ensure quotes around the key value

**"Quota exceeded" error:**
- Wait for daily quota reset (midnight UTC)
- Add billing to Google Cloud project for higher limits

**"Could not extract text from PDF" error:**
- Ensure PDF is text-based (not scanned)
- Try opening PDF and copying text to verify it's selectable
- Convert scanned PDFs using OCR tools first

**Model not found error:**
- Check internet connection
- Verify API key has Gemini API enabled
- Try different model: `gemini-2.0-flash`

## 🔒 Security

- API keys stored in `.env` file (never committed to git)
- No data stored on servers
- All processing happens client-side
- Resume text not logged or saved

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Google Gemini AI for powerful language model
- Streamlit for amazing web framework
- GDG (Google Developer Groups) for project inspiration

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Contact via LinkedIn

## 🗺️ Roadmap

- [ ] Support for multiple file formats (DOCX, TXT)
- [ ] Batch resume analysis
- [ ] Export reports to PDF
- [ ] Resume builder suggestions
- [ ] Integration with job boards
- [ ] Resume version comparison

---

**⭐ If you find this project helpful, please give it a star!**

Made with ❤️ for job seekers worldwide 

## 🧭 MERN Web App Version

This project now includes a MERN-style web application that preserves the original Streamlit app’s functionality, logic, user flow, and outputs.

### Structure

```
server/                 # Express API (auth, PDF extract, Gemini analysis)
   src/
      index.js            # App bootstrap (CORS, routes)
      routes/             # /api/auth, /api/analyze
      controllers/        # Auth + Analyze controllers
      utils/configStore.js# YAML credentials loader/saver
      prompts.js          # HR + ATS prompts (unchanged)
   package.json
   .env.example

client/                 # React app (Vite)
   src/
      App.jsx             # Auth gate + Analyzer view
      components/         # LoginSignup, Analyzer
      styles.css          # Modern styling, dark theme
   package.json
   vite.config.js
   index.html
```

### Backend Setup (Express)

1. Create server environment file:

    Copy `server/.env.example` to `server/.env` and set `GOOGLE_API_KEY`.

2. Install dependencies and run:

```powershell
cd "c:\Users\devsa\Desktop\Project of GDG\Dev Resume project\server"
npm install
npm run dev
```

Server runs on `http://localhost:4000`.

Notes:
- The backend reads and writes existing credentials from `config.yaml` to preserve the current user accounts and flows.
- Endpoints:
   - `POST /api/auth/login` — body: `{ username, password }`
   - `POST /api/auth/signup` — body: `{ name, username, email, password }`
   - `POST /api/analyze/extract-pdf` — `multipart/form-data` with `resume` (PDF)
   - `POST /api/analyze/run` — body: `{ jobDescription, resumeText, mode: 'hr'|'ats' }`

### Frontend Setup (React + Vite)

1. Install dependencies and run dev server:

```powershell
cd "c:\Users\devsa\Desktop\Project of GDG\Dev Resume project\client"
npm install
npm run dev
```

2. Configure API base URL (optional):

Create `client/.env` and set:

```env
VITE_API_BASE_URL=http://localhost:4000
```

Frontend runs on `http://localhost:5173`.

### Production Build (Serve React from Express)

```powershell
cd "c:\Users\devsa\Desktop\Project of GDG\Dev Resume project\client"
npm install
npm run build

cd "c:\Users\devsa\Desktop\Project of GDG\Dev Resume project\server"
npm install
npm run start:prod
```

Express serves the static client from `client/dist` on the same origin (no CORS needed). API remains under `/api/*`.

### Docker (One-container build)

1) Build and run with compose:

```powershell
cd "c:\Users\devsa\Desktop\Project of GDG\Dev Resume project"
$env:GOOGLE_API_KEY = "<your_gemini_api_key>"
docker compose up --build
```

2) Open http://localhost:4000 (client + API on same origin).

Notes:
- `config.yaml` is bind-mounted into the container so your users persist.
- Set `GOOGLE_API_KEY` env at run-time; do not bake it into images.
- For development, prefer running client and server separately with hot reload.

### Feature Parity

- Authentication: Login/Sign Up preserved; passwords hashed (bcryptjs). Users stored in `config.yaml` as before.
- Resume ingestion: PDF text extraction using `pdf-parse` mirrors `pdfplumber` behavior and constraints.
- Analysis: HR Review and ATS Match use identical prompts with Gemini `gemini-2.5-flash`; error handling mirrors original messages.
- Outputs: Markdown-like text displayed and downloadable as `.txt`, matching Streamlit app flow.
- UI Flow: Job Description → Upload PDF → Extract → Choose Analysis → Results → Download.

### Troubleshooting

- "API Key not found": Ensure `server/.env` includes a valid `GOOGLE_API_KEY`.
- "Could not extract text": Confirm the PDF is text-based (not scanned/image); use OCR if needed.
- Quota errors: Free tier limits apply; consider adding billing for higher quotas.

### Quick Try

1) Start the server, then the client.  
2) Sign up, log in, paste a job description, upload a text-based PDF, extract, and run either HR or ATS analysis.  
3) Download the report.
