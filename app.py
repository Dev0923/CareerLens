from dotenv import load_dotenv
load_dotenv()

import streamlit as st
import os
import pdfplumber
import re
import google.generativeai as genai
from auth_handler import AuthManager, initialize_auth_session
from datetime import datetime

# ===== AUTHENTICATION SETUP =====
# Initialize session state for authentication
initialize_auth_session()

# Create authentication manager instance
auth_manager = AuthManager()

# ===== PAGE CONFIGURATION =====
st.set_page_config(
    page_title="ATS Resume Analyzer", 
    layout="wide", 
    initial_sidebar_state="expanded",
    menu_items={
        'About': "ATS Resume Analyzer - Secure Version with Authentication"
    }
)

# ===== GEMINI API SETUP =====
# Set up the Gemini API
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    st.error("⚠️ GOOGLE_API_KEY not found in environment variables. Please check your .env file.")
    st.stop()

genai.configure(api_key=api_key)

# Function to send inputs to Gemini and get the response
def analyze_resume_with_gemini(job_desc, resume_text, prompt_text):
    try:
        model = genai.GenerativeModel("models/gemini-2.5-flash")
        
        # Combine all inputs into a single prompt
        full_prompt = f"""{prompt_text}

=== JOB DESCRIPTION ===
{job_desc}

=== RESUME TEXT ===
{resume_text}
"""
        
        response = model.generate_content(full_prompt)
        return response.text, None
    except Exception as error:
        error_msg = str(error)
        if "429" in error_msg:
            return None, "⚠️ API quota exceeded. Please try again later or add billing to your Google Cloud project."
        elif "400" in error_msg or "INVALID" in error_msg:
            return None, "⚠️ Invalid API key. Please check your .env file and ensure the key is valid."
        elif "404" in error_msg:
            return None, "⚠️ Model not found. The gemini-1.5-flash model may not be available."
        else:
            return None, f"⚠️ API Error: {error_msg[:200]}"

# Extract text from PDF using pdfplumber
def extract_text_from_pdf(uploaded_pdf):
    try:
        text_content = []
        
        with pdfplumber.open(uploaded_pdf) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_content.append(page_text)
        
        # Combine all pages
        full_text = "\n\n".join(text_content)
        
        # Clean the text
        full_text = full_text.strip()
        
        # Remove excessive blank lines
        full_text = re.sub(r'\n{3,}', '\n\n', full_text)
        
        # Check if text was extracted
        if not full_text or len(full_text) < 100:
            return None, "⚠️ Could not extract text from PDF. This may be a scanned/image-based resume. Please upload a text-based PDF."
        
        # Truncate if too long (Gemini context limit consideration)
        max_length = 30000  # Conservative limit
        if len(full_text) > max_length:
            full_text = full_text[:max_length] + "\n\n[Resume truncated due to length]"
        
        return full_text, None
        
    except Exception as e:
        return None, f"⚠️ Error reading PDF: {str(e)}"

# Prompts for HR and ATS perspective
HR_PROMPT = """
You are an experienced HR specialist with strong technical awareness.
Analyze the resume against the job description provided below.

**Provide a detailed evaluation with:**

## Strengths
- List 3-5 key strengths where the candidate excels
- Highlight relevant experience and skills that match well

## Weaknesses/Gaps
- Identify areas where the candidate falls short
- Note missing qualifications or experience

## Key Observations
- Overall fit for the role
- Cultural and technical alignment
- Career progression and growth potential

## Recommendation
- Should we proceed with this candidate? (Yes/No/Maybe)
- Brief reasoning for your recommendation
"""

ATS_PROMPT = """
You are an ATS (Applicant Tracking System) analyzer.
Evaluate the resume against the job description for ATS compatibility.

**Provide a structured analysis:**

## ATS Score: [X/100]
Provide a numerical score based on keyword matching and formatting.

## Keyword Analysis
### Matching Keywords:
- List keywords from job description found in resume

### Missing Keywords:
- List critical keywords from job description NOT found in resume
- Prioritize by importance (high/medium/low)

## Formatting Assessment
- Rate formatting quality (Good/Fair/Poor)
- Identify any ATS compatibility issues
- Note any parsing problems

## Optimization Suggestions
1. Add these specific keywords: [list]
2. Improve these sections: [list]
3. Formatting fixes: [list]

## Summary
- Overall likelihood of passing ATS screening
- Top 3 actionable improvements
"""

# ===== AUTHENTICATION CHECK =====
# Render login + sign up portal if not authenticated
if st.session_state['authentication_status'] != True:
    auth_manager.render_login_page()
    auth_manager.show_auth_feedback(
        st.session_state.get('authentication_status'),
        st.session_state.get('username')
    )
    st.stop()

# ===== MAIN APP STARTS HERE (AUTHENTICATED ONLY) =====

# Modern premium styling
st.markdown(
    """
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #384347;
            --primary-light: #5a6d73;
            --primary-dark: #2a3135;
            --accent: #0ea5e9;
            --accent-dark: #0284c7;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --bg: #0f172a;
            --bg-secondary: #1e293b;
            --bg-tertiary: #334155;
            --text: #f1f5f9;
            --text-secondary: #cbd5e1;
            --border: #475569;
        }

        body, .main, .stApp {
            background: linear-gradient(135deg, #0f172a 0%, #1a2a3f 50%, #142d42 100%);
            color: var(--text);
            font-family: 'Segoe UI', 'Inter', system-ui, -apple-system, sans-serif;
            min-height: 100vh;
        }

        /* Headers */
        h1 {
            color: var(--accent);
            font-size: 2.5rem;
            font-weight: 800;
            letter-spacing: -1px;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #0ea5e9, #06b6d4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        h2, h3, h4 {
            color: var(--text);
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        h2 {
            border-bottom: 2px solid var(--accent);
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
        }

        p {
            color: var(--text-secondary);
            line-height: 1.6;
        }

        /* Text Areas and Inputs */
        textarea, .stTextInput input, .stTextArea textarea {
            background: var(--bg-secondary) !important;
            border: 2px solid var(--border) !important;
            color: var(--text) !important;
            border-radius: 12px !important;
            padding: 12px 16px !important;
            font-size: 15px !important;
            transition: all 0.3s ease !important;
        }

        textarea:focus, .stTextInput input:focus, .stTextArea textarea:focus {
            border-color: var(--accent) !important;
            box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1) !important;
            outline: none !important;
        }

        /* Buttons */
        .stButton > button, .stDownloadButton > button {
            background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
            color: white;
            border: none;
            border-radius: 10px;
            padding: 12px 28px;
            font-weight: 600;
            font-size: 15px;
            box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
            transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stButton > button:hover, .stDownloadButton > button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
            background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
        }

        .stButton > button:active, .stDownloadButton > button:active {
            transform: translateY(0);
            box-shadow: 0 2px 10px rgba(14, 165, 233, 0.2);
        }

        /* Sidebar */
        section[data-testid="stSidebar"] {
            background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--primary) 100%);
            border-right: 1px solid var(--border);
        }

        section[data-testid="stSidebar"] h2 {
            color: var(--accent);
            border-color: var(--accent);
        }

        section[data-testid="stSidebar"] p, 
        section[data-testid="stSidebar"] span,
        section[data-testid="stSidebar"] [data-testid="stMarkdownContainer"] {
            color: var(--text-secondary) !important;
        }

        section[data-testid="stSidebar"] .stMarkdown {
            color: var(--text) !important;
        }

        /* File uploader */
        [data-testid="stFileUploader"] {
            background: var(--bg-secondary);
            border: 2px dashed var(--accent);
            border-radius: 12px;
            padding: 20px;
        }

        /* Cards and containers */
        .stTabs [data-baseweb="tab-list"] {
            gap: 0;
            background: var(--bg-secondary);
            border-bottom: 2px solid var(--border);
            border-radius: 10px 10px 0 0;
        }

        .stTabs [data-baseweb="tab"] {
            color: var(--text-secondary);
            border-bottom: 3px solid transparent;
            padding: 12px 24px;
            transition: all 0.3s ease;
        }

        .stTabs [data-baseweb="tab"][aria-selected="true"] {
            color: var(--accent);
            border-bottom-color: var(--accent);
        }

        /* Alerts */
        .stAlert {
            border-radius: 10px;
            border-left: 4px solid var(--accent);
        }

        .stAlert > div {
            background: var(--bg-secondary);
            border: 1px solid var(--border);
        }

        /* Divider */
        hr {
            border: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--border), transparent);
            margin: 2rem 0;
        }

        /* Links */
        a {
            color: var(--accent);
            text-decoration: none;
            transition: all 0.3s ease;
            font-weight: 500;
        }

        a:hover {
            color: #06b6d4;
            text-decoration: underline;
        }

        /* Success/Error messages */
        .stSuccess {
            background: rgba(16, 185, 129, 0.1) !important;
            border-left-color: var(--success) !important;
        }

        .stError {
            background: rgba(239, 68, 68, 0.1) !important;
            border-left-color: var(--danger) !important;
        }

        .stWarning {
            background: rgba(245, 158, 11, 0.1) !important;
            border-left-color: var(--warning) !important;
        }

        .stInfo {
            background: rgba(14, 165, 233, 0.1) !important;
            border-left-color: var(--accent) !important;
        }

        /* Footer */
        .footer {
            text-align: center;
            padding: 2rem 1rem;
            border-top: 1px solid var(--border);
            margin-top: 3rem;
            color: var(--text-secondary);
            font-size: 14px;
        }

        .footer a {
            color: var(--accent);
            font-weight: 600;
        }

        /* Columns spacing */
        .stColumns {
            gap: 1.5rem;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-secondary);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--accent);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #06b6d4;
        }
    </style>
    """,
    unsafe_allow_html=True,
)

st.title("📄 Resume ATS Analyzer")
st.write("Evaluate your resume against job descriptions using advanced AI analysis. Get detailed insights from HR and ATS perspectives.")

# Sidebar
with st.sidebar:
    # ===== USER INFO & LOGOUT =====
    st.markdown("---")
    col_user, col_logout = st.columns([2, 1])
    
    with col_user:
        user_info = auth_manager.get_user_info()
        st.markdown(f"""
        ### 👤 {user_info['name']}
        **@{user_info['username']}**
        """)
    
    with col_logout:
        if st.button("🚪", key="logout_btn", help="Logout"):
            st.session_state['authentication_status'] = False
            st.session_state['username'] = None
            st.session_state['name'] = None
            st.success("✅ Logged out!")
            st.rerun()
    
    st.markdown("---")
    
    st.header("📋 How It Works")
    st.markdown("""
    **Follow these steps:**
    
    1️⃣ **Paste Job Description** - Enter or paste the target job posting
    
    2️⃣ **Upload Resume** - Upload your **text-based** PDF resume
    
    3️⃣ **Run Analysis** - Choose HR Review or ATS Match
    
    4️⃣ **Get Results** - View detailed feedback and download report
    """)
    
    st.divider()
    
    st.subheader("💡 Tips")
    st.caption("• Use text-based PDFs only (not scanned images)\n• Include complete job descriptions for accuracy\n• Both analyses provide different insights\n• Keep resumes under 10 pages for best results")
    
    st.divider()
    
    st.subheader("⚙️ Tech Stack")
    st.caption("• AI Model: Gemini 1.5 Flash\n• Text Extraction: pdfplumber\n• Framework: Streamlit")
    
    st.divider()
    
    st.subheader("🔧 About")
    st.caption("Built with Streamlit + Gemini AI to help you optimize your resume matching")


# Main content area
st.markdown("---")

col_job, col_upload = st.columns([1.2, 1], gap="large")

with col_job:
    st.subheader("📝 Job Description")
    job_description = st.text_area("Paste the job description below:", height=250, placeholder="Paste the complete job posting here...")

with col_upload:
    st.subheader("📄 Your Resume")
    uploaded_resume = st.file_uploader("Upload PDF Resume", type=["pdf"], help="Select your resume in PDF format")

resume_ready = False
resume_text = None

if uploaded_resume:
    with st.spinner("📄 Extracting text from PDF..."):
        resume_text, error = extract_text_from_pdf(uploaded_resume)
        
        if error:
            st.error(error)
            resume_ready = False
        elif resume_text:
            st.success(f"✓ Resume uploaded successfully! ({len(resume_text)} characters extracted)")
            resume_ready = True
            
            # Show preview of extracted text
            with st.expander("👁️ Preview Extracted Text", expanded=False):
                preview_text = resume_text[:500] + "..." if len(resume_text) > 500 else resume_text
                st.text_area("First 500 characters:", preview_text, height=200, disabled=True)

st.markdown("---")

# Analysis buttons
st.subheader("🚀 Run Analysis")
col_hr, col_ats = st.columns(2, gap="medium")

with col_hr:
    do_hr_eval = st.button("🔍 HR Review", use_container_width=True, help="Get feedback from an HR specialist perspective")

with col_ats:
    do_ats_eval = st.button("📊 ATS Match Score", use_container_width=True, help="See how well your resume matches the ATS system")

# Perform analysis if triggered
if (do_hr_eval or do_ats_eval):
    if not job_description or not job_description.strip():
        st.error("⚠️ Please enter a job description before analyzing.")
    elif not resume_ready or not resume_text:
        st.error("⚠️ Please upload a valid resume PDF to proceed.")
    else:
        with st.spinner("🤖 Analyzing your resume... This may take a moment"):
            selected_prompt = HR_PROMPT if do_hr_eval else ATS_PROMPT
            output, error = analyze_resume_with_gemini(job_description, resume_text, selected_prompt)

            if error:
                st.error(error)
            elif output:
                st.markdown("---")
                
                analysis_type = "HR Review Results" if do_hr_eval else "ATS Match Analysis"
                st.subheader(f"✨ {analysis_type}")
                
                # Display result using markdown for better formatting
                st.markdown(output)

                col_download, col_new = st.columns(2)
                
                with col_download:
                    st.download_button(
                        label="⬇️ Download Report",
                        data=output,
                        file_name=f"resume_analysis_{analysis_type.replace(' ', '_').lower()}.txt",
                        mime="text/plain",
                        use_container_width=True
                    )
                
                with col_new:
                    if st.button("🔄 Run Another Analysis", use_container_width=True):
                        st.rerun()

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; padding: 30px 0; border-top: 1px solid var(--border); color: var(--text-secondary);">
    <p style="margin-bottom: 10px;">✨ <strong>Resume ATS Analyzer</strong> powered by Gemini AI</p>
    <p style="font-size: 11px; margin-top: 15px; color: var(--border);">© 2025 • GDG Project</p>
</div>
""", unsafe_allow_html=True)
