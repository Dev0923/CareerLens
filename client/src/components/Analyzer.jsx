import React, { useState, useEffect } from 'react';
import API from '../apiBase.js';
import SkillGapAnalyzer from './SkillGapAnalyzer.jsx';
import CareerRoadmapGenerator from './CareerRoadmapGenerator.jsx';
import { trackResumeAnalysis } from '../utils/activityTracker.js';
import jsPDF from 'jspdf';

export default function Analyzer({ user, onLogout, showSkillGapOnly = false, showRoadmapOnly = false }) {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState(null);
  const [status, setStatus] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSkillGap, setShowSkillGap] = useState(showSkillGapOnly);
  const [showRoadmap, setShowRoadmap] = useState(showRoadmapOnly);
  const [extracting, setExtracting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync state with props when they change
  useEffect(() => {
    setShowSkillGap(showSkillGapOnly);
    setShowRoadmap(showRoadmapOnly);
  }, [showSkillGapOnly, showRoadmapOnly]);

  // Auto-extract when file is selected
  useEffect(() => {
    if (resumeFile && !extracting) {
      extractPdf();
    }
  }, [resumeFile]);

  async function extractPdf() {
    setExtracting(true);
    setStatus('📄 Extracting text from PDF...');
    setOutput(null);
    setResumeText(null);
    if (!resumeFile) {
      setExtracting(false);
      return setStatus('⚠️ Please select a PDF file.');
    }
    const form = new FormData();
    form.append('resume', resumeFile);
    try {
      const res = await fetch(`${API}/api/analyze/extract-pdf`, { method: 'POST', body: form });
      const data = await res.json();
      if (!data.ok) {
        setStatus(data.error);
        setExtracting(false);
        return;
      }
      setResumeText(data.text);
      console.log('Resume text set:', data.text?.length, 'chars');
      setStatus(`✓ Resume uploaded successfully! (${data.length} characters extracted)`);
      setCurrentStep(2);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (e) { 
      setStatus(e.message); 
    }
    setExtracting(false);
  }

  async function run(mode) {
    setLoading(true); setStatus('🤖 Analyzing your resume... This may take a moment'); setOutput(null);
    try {
      const res = await fetch(`${API}/api/analyze/run`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resumeText, mode })
      });
      const data = await res.json();
      if (!data.ok) { setStatus(data.error); setLoading(false); return; }
      setOutput(data.output);
      setStatus(null);
      
      // Extract ATS score and track activity if this was an ATS analysis
      if (mode === 'ats' && data.output) {
        const scoreMatch = data.output.match(/(\d+)%|Score[:\s]+(\d+)|ATS[:\s]+(\d+)/i);
        if (scoreMatch) {
          const score = parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3]);
          if (score >= 0 && score <= 100) {
            trackResumeAnalysis(score);
          }
        }
      }
    } catch (e) { setStatus(e.message); }
    setLoading(false);
  }

  function download() {
    if (!output) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let y = 20;

    // Helper function to add text with word wrap
    const addText = (text, size = 12, isBold = false, color = [0, 0, 0]) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach(line => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += size * 0.5;
      });
      y += 3;
    };

    // Determine report type
    const isATS = output?.includes('ATS');
    const reportType = isATS ? 'ATS Match Score Report' : 'HR Review Report';
    const fileName = isATS ? 'resume_analysis_ats_match' : 'resume_analysis_hr_review';

    // Title
    addText(reportType.toUpperCase(), 18, true, [0, 180, 168]);
    y += 5;

    // Process the output text
    const sections = output.split('\n');
    sections.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        y += 2;
        return;
      }

      // Handle different formatting
      if (trimmedLine.startsWith('##')) {
        // Main section headers
        addText(trimmedLine.replace('##', '').trim(), 14, true, [0, 0, 0]);
        y += 2;
      } else if (trimmedLine.startsWith('*')) {
        // Bullet points
        addText(trimmedLine, 10, false, [0, 0, 0]);
      } else if (trimmedLine.includes('**')) {
        // Bold text
        const cleanText = trimmedLine.replace(/\*\*/g, '');
        addText(cleanText, 11, true, [0, 0, 0]);
      } else if (trimmedLine.match(/^\d+\./)) {
        // Numbered lists
        addText(trimmedLine, 10, false, [0, 0, 0]);
      } else {
        // Regular text
        addText(trimmedLine, 10, false, [0, 0, 0]);
      }
    });

    // Save PDF
    doc.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  return (
    <div className="analyzer-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>
      
      {/* Success Popup */}
      {showSuccess && (
        <div className="success-popup">
          <div className="success-icon">✓</div>
          <p>Resume extracted successfully!</p>
        </div>
      )}

      <div className="analyzer-main">
        {showRoadmap ? (
          <CareerRoadmapGenerator onBack={() => setShowRoadmap(false)} />
        ) : showSkillGap ? (
          <SkillGapAnalyzer resumeText={resumeText} onBack={() => setShowSkillGap(false)} />
        ) : (
          <>
        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${(currentStep / 3) * 100}%` }}></div>
          <div className="progress-label">Step {currentStep} of 3</div>
        </div>

        {/* Steps Guide Section */}
        <div className="steps-section">
          <h2 className="steps-title">📋 How to Get Started</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Upload Resume</h3>
                <p>Select your PDF resume - it will be auto-extracted</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Add Job Description</h3>
                <p>Paste the job posting you're targeting</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Get Analysis</h3>
                <p>Click HR Review or ATS Match Score button</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Resume Section */}
        <div className="upload-section">
          <div className="upload-header">
            <div className="upload-icon-large">📁</div>
            <div className="upload-header-text">
              <h3 className="upload-title">Upload files</h3>
              <p className="upload-subtitle">Select and upload the files of your choice</p>
            </div>
          </div>
          
          <div className="upload-box">
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={e=>setResumeFile(e.target.files[0])}
              id="resume-upload"
              className="file-input"
            />
            <label htmlFor="resume-upload" className="upload-label">
              {resumeFile ? (
                <>
                  <div className="file-success-icon">✓</div>
                  <div className="file-name">{resumeFile.name}</div>
                  {extracting && <div className="extracting-text">⏳ Extracting text...</div>}
                </>
              ) : (
                <>
                  <div className="upload-placeholder-icon">📄</div>
                  <div className="upload-placeholder-text">Choose a file or drag & drop it here</div>
                  <div className="upload-placeholder-subtext">PDF format, up to 10MB</div>
                  <button type="button" className="browse-btn">Browse File</button>
                </>
              )}
            </label>
            {status && <div className="status-message">{status}</div>}
          </div>
          
          {/* Preview Resume Section */}
          {resumeText && (
            <div className="preview-section">
              <button 
                onClick={() => setShowPreview(!showPreview)} 
                className="preview-toggle-btn"
              >
                {showPreview ? '👁️ Hide Resume Preview' : '👁️ Review Resume'}
              </button>
              {showPreview && (
                <div className="preview-content">
                  <h4>Extracted Resume Text:</h4>
                  <div className="preview-text">
                    {resumeText}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Job Description Section */}
        {resumeText && (
          <div className="job-section">
            <h3 className="section-title">📝 Job Description</h3>
            <textarea 
              placeholder="Paste the complete job posting here..." 
              value={jobDescription} 
              onChange={e=>{
                setJobDescription(e.target.value);
                if(e.target.value.length > 50) setCurrentStep(3);
              }} 
              rows={12}
              className="job-textarea"
            />
          </div>
        )}

        {/* Analysis Buttons Section */}
        {resumeText && jobDescription && (
          <div className="analysis-section">
            <h3 className="section-title">🎯 Run Analysis</h3>
            <div className="analysis-buttons">
              <button 
                onClick={()=>run('hr')} 
                disabled={loading}
                className="analysis-btn hr-btn"
              >
                <span className="btn-icon">👔</span>
                <span className="btn-text">HR Review</span>
                <span className="btn-desc">Get detailed HR feedback</span>
              </button>
              <button 
                onClick={()=>run('ats')} 
                disabled={loading}
                className="analysis-btn ats-btn"
              >
                <span className="btn-icon">🎯</span>
                <span className="btn-text">ATS Match Score</span>
                <span className="btn-desc">Check compatibility score</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="loading-section">
            <div className="spinner"></div>
            <p>🤖 Analyzing your resume... This may take a moment</p>
          </div>
        )}

        {/* Output Section */}
        {output && (
          <div className="output-section">
            <h3 className="output-title">{(output.includes('ATS')? '🎯 ATS Match Analysis' : '👔 HR Review Results')}</h3>
            <div className="output-content">{output}</div>
            <div className="output-actions">
              <button onClick={download} className="download-btn">📥 Download Report</button>
              <button onClick={()=>{ setOutput(null); setStatus(null); setResumeFile(null); setResumeText(null); setJobDescription(''); }} className="reset-btn">🔄 Run Another Analysis</button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="analyzer-footer">
          <strong>CareerLens</strong> powered by Gemini AI
          <div className="footer-text">© 2026 • GDG Project</div>
        </div>
        </>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes ripple {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 180, 168, 0.7),
                        0 0 0 10px rgba(0, 180, 168, 0.5),
                        0 0 0 20px rgba(0, 180, 168, 0.3);
          }
          100% {
            box-shadow: 0 0 0 10px rgba(0, 180, 168, 0.5),
                        0 0 0 20px rgba(0, 180, 168, 0.3),
                        0 0 0 30px rgba(0, 180, 168, 0);
          }
        }

        .analyzer-container {
          width: 100%;
          min-height: 100vh;
          padding: 0;
          background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%);
          position: relative;
          overflow-x: hidden;
        }

        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: float 20s ease-in-out infinite;
        }

        .shape-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(0, 180, 168, 0.4) 0%, transparent 70%);
          top: -200px;
          right: -200px;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(29, 181, 132, 0.3) 0%, transparent 70%);
          bottom: -150px;
          left: -150px;
          animation-delay: 7s;
        }

        .shape-3 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(0, 180, 168, 0.25) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 14s;
        }

        .progress-bar-container {
          position: relative;
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          margin-bottom: 40px;
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #00B4A8 0%, #1DB584 50%, #00B4A8 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
          border-radius: 10px;
          transition: width 0.5s ease;
          box-shadow: 0 0 20px rgba(0, 180, 168, 0.5);
        }

        .progress-label {
          position: absolute;
          top: -25px;
          right: 0;
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .success-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 40px 60px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          animation: fadeInUp 0.5s ease;
          text-align: center;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #00B4A8 0%, #1DB584 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          margin: 0 auto 20px;
          animation: pulse 1s ease infinite;
        }

        .success-popup p {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .analyzer-main {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 60px;
          position: relative;
          z-index: 1;
        }

        .steps-section {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 48px;
          margin-bottom: 40px;
          box-shadow: 0 8px 32px rgba(0, 180, 168, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          animation: fadeInUp 0.6s ease;
        }

        .steps-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00B4A8, #1DB584, transparent);
        }

        .steps-title {
          margin: 0 0 30px 0;
          background: linear-gradient(135deg, #00B4A8 0%, #1DB584 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 28px;
          text-align: center;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .step-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .step-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .step-card:hover::before {
          left: 100%;
        }

        .step-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 12px 40px rgba(0, 180, 168, 0.3);
          border-color: rgba(0, 180, 168, 0.5);
        }

        .step-number {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #00B4A8 0%, #1DB584 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 20px;
          flex-shrink: 0;
          box-shadow: 0 4px 20px rgba(0, 180, 168, 0.4);
          position: relative;
        }

        .step-number::after {
          content: '';
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border-radius: 50%;
          border: 2px solid rgba(0, 180, 168, 0.3);
          animation: pulse 2s infinite;
        }

        .step-content h3 {
          margin: 0 0 8px 0;
          font-size: 17px;
          color: white;
          font-weight: 700;
        }

        .step-content p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }

        .upload-section, .job-section, .analysis-section {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 48px;
          margin-bottom: 40px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: fadeInUp 0.6s ease;
          animation-fill-mode: backwards;
        }

        .upload-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
        }

        .upload-icon-large {
          font-size: 72px;
          filter: drop-shadow(0 4px 12px rgba(0, 180, 168, 0.3));
        }

        .upload-header-text {
          flex: 1;
        }

        .upload-title {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.5px;
        }

        .upload-subtitle {
          margin: 0;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
        }

        .upload-section {
          animation-delay: 0.1s;
        }

        .job-section {
          animation-delay: 0.2s;
        }

        .analysis-section {
          animation-delay: 0.3s;
        }

        .section-title {
          margin: 0 0 24px 0;
          background: linear-gradient(135deg, #00B4A8 0%, #1DB584 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 22px;
          font-weight: 700;
        }

        .upload-box {
          position: relative;
        }

        .file-input {
          display: none;
        }

        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 32px;
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          min-height: 280px;
        }

        .upload-label:hover {
          border-color: rgba(0, 180, 168, 0.5);
          background: rgba(0, 180, 168, 0.05);
        }

        .upload-placeholder-icon {
          font-size: 56px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .upload-placeholder-text {
          font-size: 16px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
        }

        .upload-placeholder-subtext {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 24px;
        }

        .browse-btn {
          padding: 12px 32px;
          background: linear-gradient(135deg, #00B4A8 0%, #1DB584 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0, 180, 168, 0.3);
          pointer-events: none;
        }

        .browse-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 180, 168, 0.4);
        }

        .file-success-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #00B4A8 0%, #1DB584 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(0, 180, 168, 0.4);
        }

        .file-name {
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin-bottom: 12px;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .extracting-text {
          font-size: 14px;
          color: #00B4A8;
          font-weight: 500;
          margin-top: 8px;
        }

        .status-message {
          margin-top: 16px;
          padding: 12px 16px;
          background: rgba(0, 180, 168, 0.1);
          border-radius: 8px;
          color: #00B4A8;
          font-size: 14px;
          text-align: center;
          border: 1px solid rgba(0, 180, 168, 0.3);
        }

        .preview-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(0, 180, 168, 0.15);
        }

        .preview-toggle-btn {
          width: 100%;
          padding: 12px 20px;
          background: linear-gradient(135deg, #00B4A8 0%, #1DB584 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .preview-toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 180, 168, 0.3);
        }

        .preview-content {
          margin-top: 16px;
          background: #f8fffe;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(0, 180, 168, 0.2);
        }

        .preview-content h4 {
          margin: 0 0 12px 0;
          color: #00B4A8;
          font-size: 15px;
        }

        .preview-text {
          max-height: 400px;
          overflow-y: auto;
          padding: 16px;
          background: white;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.8;
          color: #333;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .preview-text::-webkit-scrollbar {
          width: 8px;
        }

        .preview-text::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .preview-text::-webkit-scrollbar-thumb {
          background: #00B4A8;
          border-radius: 4px;
        }

        .preview-text::-webkit-scrollbar-thumb:hover {
          background: #1DB584;
        }

        .job-textarea {
          width: 100%;
          padding: 16px;
          border: 2px solid rgba(0, 180, 168, 0.3);
          border-radius: 12px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .job-textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .job-textarea:focus {
          outline: none;
          border-color: #00B4A8;
          box-shadow: 0 0 20px rgba(0, 180, 168, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }

        .analysis-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .analysis-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 32px 24px;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .analysis-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .analysis-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .analysis-btn:active {
          transform: translateY(-4px) scale(0.95);
        }

        .analysis-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .hr-btn {
          background: linear-gradient(135deg, #00B4A8 0%, #1DB584 100%);
          color: white;
          box-shadow: 0 8px 24px rgba(0, 180, 168, 0.25);
        }

        .ats-btn {
          background: linear-gradient(135deg, #1DB584 0%, #00B4A8 100%);
          color: white;
          box-shadow: 0 8px 24px rgba(29, 181, 132, 0.25);
        }

        .analysis-btn:hover:not(:disabled) {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 180, 168, 0.35);
        }

        .btn-icon {
          font-size: 42px;
          margin-bottom: 12px;
        }

        .btn-text {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .btn-desc {
          font-size: 13px;
          opacity: 0.9;
        }

        .loading-section {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 48px 24px;
          margin-bottom: 24px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 180, 168, 0.2);
        }

        .loading-section p {
          color: white;
          font-size: 16px;
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(0, 180, 168, 0.1);
          border-top-color: #00B4A8;
          border-radius: 50%;
          animation: spin 1s linear infinite, ripple 1.5s ease-out infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .output-section {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 8px 32px rgba(0, 180, 168, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: fadeInUp 0.6s ease;
        }

        .output-title {
          margin: 0 0 20px 0;
          background: linear-gradient(135deg, #00B4A8 0%, #1DB584 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 24px;
          font-weight: 700;
        }

        .output-content {
          background: rgba(0, 180, 168, 0.05);
          padding: 24px;
          border-radius: 12px;
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 20px;
          border-left: 4px solid #00B4A8;
          box-shadow: inset 0 0 20px rgba(0, 180, 168, 0.1);
          border: 1px solid rgba(0, 180, 168, 0.3);
        }

        .output-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .download-btn, .reset-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .download-btn {
          background: linear-gradient(135deg, #00B4A8 0%, #1DB584 100%);
          color: white;
        }

        .reset-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .reset-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 180, 168, 0.4);
        }

        .tools-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .tool-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 180, 168, 0.15);
          transition: all 0.3s ease;
        }

        .tool-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0, 180, 168, 0.25);
          border-color: rgba(0, 180, 168, 0.3);
        }

        .tool-card h4 {
          margin: 0 0 12px 0;
          color: white;
          font-size: 18px;
          font-weight: 700;
        }

        .tool-card p {
          margin: 0 0 16px 0;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          line-height: 1.6;
        }

        .tool-btn {
          width: 100%;
          padding: 12px 20px;
          background: linear-gradient(135deg, #00B4A8 0%, #1DB584 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tool-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 180, 168, 0.3);
        }

        .analyzer-footer {
          text-align: center;
          padding: 24px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        .footer-text {
          margin-top: 8px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
        }

        @media (max-width: 1024px) {
          .analyzer-main {
            padding: 32px 40px;
          }
        }

        @media (max-width: 768px) {
          .analyzer-main {
            padding: 24px 20px;
          }

          .steps-section,
          .upload-section,
          .job-section,
          .analysis-section {
            padding: 32px 24px;
          }

          .steps-grid {
            grid-template-columns: 1fr;
          }

          .analysis-buttons {
            grid-template-columns: 1fr;
          }

          .tools-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
