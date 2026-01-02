import React, { useState } from 'react';
import API from '../apiBase.js';
import { trackSkillGapAnalysis } from '../utils/activityTracker.js';
import jsPDF from 'jspdf';

export default function SkillGapAnalyzer({ resumeText: initialResumeText, onBack }) {
  const [resumeText, setResumeText] = useState(initialResumeText || '');
  const [jobRole, setJobRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [showGuide, setShowGuide] = useState(!initialResumeText);

  async function runSkillGapAnalysis() {
    if (!resumeText.trim()) {
      setStatus('⚠️ Please upload or provide your resume first');
      return;
    }
    if (!jobRole.trim()) {
      setStatus('⚠️ Please enter a target job role');
      return;
    }

    setLoading(true);
    setStatus('🤖 Analyzing skill gaps... This may take a moment');
    setAnalysis(null);

    try {
      const res = await fetch(`${API}/api/analyze/skill-gap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobRole,
          experienceLevel: experienceLevel || undefined
        })
      });

      const data = await res.json();
      if (!data.ok) {
        setStatus(data.error);
        setLoading(false);
        return;
      }

      setAnalysis(data.analysis);
      setStatus(null);
      trackSkillGapAnalysis(jobRole);
    } catch (e) {
      setStatus(`⚠️ Error: ${e.message}`);
    }
    setLoading(false);
  }

  function handleResumeUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target.result);
        setShowGuide(false);
      };
      reader.readAsText(file);
    }
  }

  function backToGuide() {
    setShowGuide(true);
    setAnalysis(null);
    setJobRole('');
    setExperienceLevel('');
    setStatus(null);
  }

  function downloadReport() {
    if (!analysis) return;
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
      y += 5;
    };

    // Title
    addText('SKILL GAP ANALYSIS REPORT', 20, true, [0, 180, 168]);
    y += 5;

    // Current Profile
    addText('CURRENT PROFILE', 16, true, [0, 0, 0]);
    addText(`Estimated Current Salary: ${analysis.currentProfile.estimatedCurrentSalary}`, 11);
    addText(`Overall Profile Strength: ${analysis.currentProfile.overallProfileStrength}`, 11);
    y += 5;

    // Skills Analysis
    addText('SKILLS ANALYSIS', 16, true, [0, 0, 0]);
    
    addText('Matching Skills:', 12, true, [40, 167, 69]);
    analysis.skillsAnalysis.matchingSkills.forEach(skill => {
      addText(`• ${skill}`, 10);
    });
    y += 3;

    addText('Missing Skills:', 12, true, [220, 53, 69]);
    analysis.skillsAnalysis.missingSkills.forEach(skill => {
      addText(`• ${skill}`, 10);
    });
    y += 3;

    if (analysis.skillsAnalysis.partialSkills.length > 0) {
      addText('Partially Present Skills:', 12, true, [255, 193, 7]);
      analysis.skillsAnalysis.partialSkills.forEach(skill => {
        addText(`• ${skill}`, 10);
      });
      y += 3;
    }

    // Skill Gap Details
    if (analysis.skillGapDetails && analysis.skillGapDetails.length > 0) {
      addText('SKILL GAP DETAILS', 16, true, [0, 0, 0]);
      analysis.skillGapDetails.forEach(detail => {
        addText(`Skill: ${detail.skill}`, 12, true);
        addText(`Importance: ${detail.importance}`, 10);
        addText(`Hiring Impact: ${detail.hiringImpact}`, 10);
        addText(`Estimated Salary Increase: ${detail.estimatedSalaryIncreasePercent}%`, 10);
        y += 3;
      });
    }

    // Salary Projection
    addText('SALARY PROJECTION', 16, true, [0, 0, 0]);
    addText(`Projected Salary Range: ${analysis.salaryProjection.projectedSalaryRange}`, 11);
    addText(`Estimated Total Hike: ${analysis.salaryProjection.estimatedTotalHikePercent}%`, 11);
    y += 5;

    // Disclaimer
    addText('DISCLAIMER', 14, true, [0, 0, 0]);
    addText(analysis.disclaimer, 9);

    // Save PDF
    doc.save(`skill_gap_analysis_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  return (
    <div style={{
      minHeight: '100vh',
      height: '100vh',
      background: '#1a1a2e',
      padding: '0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 180, 168, 0.2);
        }
        .step-card {
          animation: fadeInUp 0.6s ease-out backwards;
        }
      `}</style>

      {/* Main White Container */}
      <div style={{
        width: '100%',
        height: '100%',
        background: 'white',
        borderRadius: '0',
        padding: '40px',
        boxShadow: 'none',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '2px solid #f0f0f0'
        }}>
          <div>
            <h1 style={{
              fontSize: '36px',
              margin: 0,
              color: '#00B4A8',
              fontWeight: '900',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              🎯 Skill Gap Analyzer
            </h1>
            <p style={{ margin: '8px 0 0 0', color: '#999', fontSize: '14px' }}>
              Discover your skill gaps and salary potential
            </p>
          </div>
          <button 
            onClick={backToGuide} 
            style={{
              background: '#f0e6f6',
              border: '2px solid #d0c0e0',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#1a1a2e',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => {
              e.target.style.background = '#e0d6f0';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.target.style.background = '#f0e6f6';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ← Back
          </button>
        </div>

        {/* Show Guide or Analysis */}
        {showGuide && !analysis ? (
          <div>
          {/* Step-by-Step Guide */}
          <div style={{
            marginBottom: '40px',
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            <h2 style={{
              fontSize: '32px',
              margin: '0 0 48px',
              color: '#1a1a2e',
              textAlign: 'center',
              fontWeight: '700'
            }}>
              📚 How to Use Skill Gap Finder
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px'
            }}>
              {[
                { step: 1, icon: '📄', title: 'Upload Your Resume', desc: 'Share your current resume in PDF or text format' },
                { step: 2, icon: '🎯', title: 'Set Target Role', desc: 'Tell us which job role you\'re aiming for' },
                { step: 3, icon: '📊', title: 'Get Analysis', desc: 'Receive detailed skill gap and salary insights' },
                { step: 4, icon: '🚀', title: 'Create Growth Plan', desc: 'Get actionable steps to bridge your skill gaps' }
              ].map((item, idx) => (
                <div key={idx} className="step-card" style={{
                  padding: '32px',
                  background: 'linear-gradient(135deg, rgba(200, 242, 230, 0.3) 0%, rgba(174, 234, 224, 0.3) 100%)',
                  border: '2px solid rgba(0, 180, 168, 0.2)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  animationDelay: `${idx * 0.1}s`,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 180, 168, 0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ 
                    fontSize: '64px', 
                    minWidth: '80px',
                    textAlign: 'center'
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#00B4A8',
                      marginBottom: '8px',
                      letterSpacing: '1.5px'
                    }}>
                      STEP {item.step}
                    </div>
                    <h3 style={{ 
                      margin: '0 0 8px', 
                      color: '#1a1a2e', 
                      fontSize: '20px', 
                      fontWeight: '700' 
                    }}>
                      {item.title}
                    </h3>
                    <p style={{ 
                      margin: 0, 
                      color: '#666', 
                      fontSize: '14px', 
                      lineHeight: '1.6' 
                    }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

            {/* Resume Upload Section */}
            <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '2px solid #f0f0f0' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 24px', color: '#1a1a2e', fontWeight: '600', textAlign: 'center' }}>
                📤 Step 1: Upload Your Resume
              </h3>
              
              <div style={{
                background: 'linear-gradient(135deg, rgba(200, 242, 230, 0.2) 0%, rgba(174, 234, 224, 0.2) 100%)',
                border: '2px dashed rgba(0, 180, 168, 0.4)',
                borderRadius: '16px',
                padding: '50px 40px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onDragOver={e => {
                e.preventDefault();
                e.target.style.borderColor = '#00B4A8';
                e.target.style.background = 'linear-gradient(135deg, rgba(200, 242, 230, 0.35) 0%, rgba(174, 234, 224, 0.35) 100%)';
              }}
              onDragLeave={e => {
                e.target.style.borderColor = 'rgba(0, 180, 168, 0.4)';
                e.target.style.background = 'linear-gradient(135deg, rgba(200, 242, 230, 0.2) 0%, rgba(174, 234, 224, 0.2) 100%)';
              }}
              onDrop={e => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files[0]) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setResumeText(event.target.result);
                    setShowGuide(false);
                  };
                  reader.readAsText(files[0]);
                }
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
                <p style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '600', color: '#1a1a2e' }}>
                  Drag & drop your resume or click to browse
                </p>
                <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>
                  Supports TXT and PDF files
                </p>
                <input
                  type="file"
                  accept=".txt,.pdf"
                  onChange={handleResumeUpload}
                  style={{ display: 'none' }}
                  id="resume-upload"
                />
                <button
                  onClick={() => document.getElementById('resume-upload').click()}
                  style={{
                    marginTop: '20px',
                    background: 'linear-gradient(135deg, #00B4A8 0%, #1DB584 100%)',
                    color: 'white',
                    padding: '12px 32px',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 25px rgba(0, 180, 168, 0.3)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Choose File
                </button>
              </div>
            </div>
          </div>
      ) : !analysis ? (
        <div>
          {/* Resume Uploaded - Show Input Form */}
          <div style={{
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            {/* Resume Status */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(200, 242, 230, 0.3) 0%, rgba(174, 234, 224, 0.3) 100%)',
              border: '2px solid rgba(0, 180, 168, 0.3)',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#00B4A8' }}>
                  ✓ Resume Uploaded Successfully
                </p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>
                  {resumeText.length} characters detected
                </p>
              </div>
              <button
                onClick={() => {
                  setResumeText('');
                  setShowGuide(true);
                  setJobRole('');
                  setExperienceLevel('');
                }}
                style={{
                  background: '#f5f5f5',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: '#666',
                  fontSize: '13px'
                }}
              >
                Change Resume
              </button>
            </div>

            {/* Input Form */}
            <h3 style={{ fontSize: '20px', margin: '0 0 24px', color: '#1a1a2e' }}>
              📋 Step 2: Enter Job Details
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {/* Target Job Role */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '12px',
                  fontWeight: '600',
                  color: '#1a1a2e',
                  fontSize: '15px'
                }}>
                  <span style={{ fontSize: '18px', marginRight: '6px' }}>🎯</span> Target Job Role
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior React Developer"
                  value={jobRole}
                  onChange={e => setJobRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e0e0e0',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s',
                    background: 'white'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#00B4A8';
                    e.target.style.boxShadow = '0 0 0 4px rgba(0, 180, 168, 0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Experience Level */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '12px',
                  fontWeight: '600',
                  color: '#1a1a2e',
                  fontSize: '15px'
                }}>
                  <span style={{ fontSize: '18px', marginRight: '6px' }}>📈</span> Experience Level (Optional)
                </label>
                <select
                  value={experienceLevel}
                  onChange={e => setExperienceLevel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e0e0e0',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    background: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#00B4A8';
                    e.target.style.boxShadow = '0 0 0 4px rgba(0, 180, 168, 0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select your experience level</option>
                  <option value="Fresher (0-1 years)">Fresher (0-1 years)</option>
                  <option value="Junior (1-3 years)">Junior (1-3 years)</option>
                  <option value="Mid-level (3-5 years)">Mid-level (3-5 years)</option>
                  <option value="Senior (5-8 years)">Senior (5-8 years)</option>
                  <option value="Lead/Manager (8+ years)">Lead/Manager (8+ years)</option>
                </select>
              </div>
            </div>

            {/* Status Message */}
            {status && (
              <div style={{
                background: '#fff3cd',
                border: '2px solid #ffc107',
                color: '#856404',
                padding: '16px',
                borderRadius: '10px',
                marginBottom: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {status}
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={runSkillGapAnalysis}
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #00B4A8 0%, #1DB584 100%)',
                color: 'white',
                padding: '16px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                boxShadow: loading ? 'none' : '0 8px 20px rgba(0, 180, 168, 0.3)'
              }}
              onMouseEnter={e => !loading && (
                e.target.style.transform = 'translateY(-2px)',
                e.target.style.boxShadow = '0 12px 30px rgba(0, 180, 168, 0.4)'
              )}
              onMouseLeave={e => !loading && (
                e.target.style.transform = 'translateY(0)',
                e.target.style.boxShadow = '0 8px 20px rgba(0, 180, 168, 0.3)'
              )}
            >
              {loading ? '⏳ Analyzing Your Skills...' : '🔍 Analyze Skill Gaps'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Current Profile */}
          <div style={{ 
            background: 'white',
            borderRadius: '16px',
            padding: '28px', 
            marginBottom: '24px',
            animation: 'fadeInUp 0.6s ease-out'
          }}>
            <h3 style={{ margin: '0 0 20px', color: '#1a1a2e', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>📊</span> Current Profile
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(0, 180, 168, 0.05)', borderRadius: '10px' }}>
                <p style={{ margin: '0 0 8px', color: '#666', fontSize: '13px' }}>Estimated Salary</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#00B4A8', margin: 0 }}>{analysis.currentProfile.estimatedCurrentSalary}</p>
              </div>
              <div style={{ padding: '16px', background: 'rgba(29, 181, 132, 0.05)', borderRadius: '10px' }}>
                <p style={{ margin: '0 0 8px', color: '#666', fontSize: '13px' }}>Profile Strength</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: analysis.currentProfile.overallProfileStrength === 'High' ? '#28a745' : analysis.currentProfile.overallProfileStrength === 'Medium' ? '#ffc107' : '#dc3545', margin: 0 }}>
                  {analysis.currentProfile.overallProfileStrength}
                </p>
              </div>
            </div>
          </div>

          {/* Skills Analysis */}
          <div style={{ 
            background: 'white',
            borderRadius: '16px', 
            padding: '28px', 
            marginBottom: '24px',
            animation: 'fadeInUp 0.7s ease-out'
          }}>
            <h3 style={{ margin: '0 0 20px', color: '#1a1a2e', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>💡</span> Skills Analysis
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Matching Skills */}
              <div style={{ padding: '16px', background: 'rgba(40, 167, 69, 0.05)', border: '2px solid rgba(40, 167, 69, 0.2)', borderRadius: '10px' }}>
                <h4 style={{ margin: '0 0 12px', color: '#28a745', fontSize: '15px' }}>✓ Matching Skills ({analysis.skillsAnalysis.matchingSkills.length})</h4>
                {analysis.skillsAnalysis.matchingSkills.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {analysis.skillsAnalysis.matchingSkills.map((skill, idx) => (
                      <li key={idx} style={{ color: '#666', marginBottom: '4px', fontSize: '14px' }}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>No matching skills found</p>
                )}
              </div>

              {/* Missing Skills */}
              <div style={{ padding: '16px', background: 'rgba(220, 53, 69, 0.05)', border: '2px solid rgba(220, 53, 69, 0.2)', borderRadius: '10px' }}>
                <h4 style={{ margin: '0 0 12px', color: '#dc3545', fontSize: '15px' }}>✗ Missing Skills ({analysis.skillsAnalysis.missingSkills.length})</h4>
                {analysis.skillsAnalysis.missingSkills.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {analysis.skillsAnalysis.missingSkills.map((skill, idx) => (
                      <li key={idx} style={{ color: '#666', marginBottom: '4px', fontSize: '14px' }}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>No missing skills</p>
                )}
              </div>

              {/* Partial Skills */}
              {analysis.skillsAnalysis.partialSkills.length > 0 && (
                <div style={{ padding: '16px', background: 'rgba(255, 193, 7, 0.05)', border: '2px solid rgba(255, 193, 7, 0.2)', borderRadius: '10px' }}>
                  <h4 style={{ margin: '0 0 12px', color: '#ffc107', fontSize: '15px' }}>⚠️ Partial Skills ({analysis.skillsAnalysis.partialSkills.length})</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {analysis.skillsAnalysis.partialSkills.map((skill, idx) => (
                      <li key={idx} style={{ color: '#666', marginBottom: '4px', fontSize: '14px' }}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Skill Gap Details */}
          {analysis.skillGapDetails && analysis.skillGapDetails.length > 0 && (
            <div style={{ 
              background: 'white',
              borderRadius: '16px', 
              padding: '28px', 
              marginBottom: '24px',
              animation: 'fadeInUp 0.8s ease-out'
            }}>
              <h3 style={{ margin: '0 0 20px', color: '#1a1a2e', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>📈</span> Skill Gap Details
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {analysis.skillGapDetails.map((detail, idx) => (
                  <div key={idx} style={{
                    padding: '16px',
                    background: 'rgba(0, 180, 168, 0.05)',
                    border: '2px solid rgba(0, 180, 168, 0.2)',
                    borderRadius: '10px'
                  }}>
                    <h4 style={{ margin: '0 0 8px', color: '#00B4A8', fontSize: '15px' }}>{detail.skill}</h4>
                    <p style={{ margin: '6px 0', fontSize: '13px', color: '#666' }}><strong>Importance:</strong> {detail.importance}</p>
                    <p style={{ margin: '6px 0', fontSize: '13px', color: '#666' }}><strong>Hiring Impact:</strong> {detail.hiringImpact}</p>
                    <p style={{ margin: '6px 0 0', fontSize: '14px', color: '#28a745', fontWeight: 'bold' }}>
                      💰 Salary Increase: {detail.estimatedSalaryIncreasePercent}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Salary Projection */}
          <div style={{ 
            background: 'white',
            borderRadius: '16px', 
            padding: '28px', 
            marginBottom: '24px',
            animation: 'fadeInUp 0.9s ease-out'
          }}>
            <h3 style={{ margin: '0 0 20px', color: '#1a1a2e', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>💰</span> Salary Projection
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'white', borderRadius: '10px' }}>
                <p style={{ margin: '0 0 8px', color: '#666', fontSize: '13px' }}>After Skill Acquisition</p>
                <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#28a745', margin: 0 }}>
                  {analysis.salaryProjection.projectedSalaryRange}
                </p>
              </div>
              <div style={{ padding: '16px', background: 'white', borderRadius: '10px' }}>
                <p style={{ margin: '0 0 8px', color: '#666', fontSize: '13px' }}>Total Potential Hike</p>
                <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#28a745', margin: 0 }}>
                  {analysis.salaryProjection.estimatedTotalHikePercent}%
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ 
            background: 'white',
            borderRadius: '16px', 
            padding: '20px', 
            marginBottom: '24px',
            animation: 'fadeInUp 1s ease-out'
          }}>
            <p style={{ margin: 0, color: '#666', fontSize: '13px', lineHeight: '1.6' }}>
              <strong>📋 Disclaimer:</strong> {analysis.disclaimer}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <button 
              onClick={downloadReport}
              style={{
                padding: '14px 20px',
                background: 'linear-gradient(135deg, #00B4A8 0%, #1DB584 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(0, 180, 168, 0.3)';
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              ⬇️ Download Report
            </button>
            <button 
              onClick={() => {
                setAnalysis(null);
                setJobRole('');
                setExperienceLevel('');
                setStatus(null);
              }}
              style={{
                padding: '14px 20px',
                background: '#f5f5f5',
                color: '#1a1a2e',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => {
                e.target.style.background = '#e0e0e0';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.target.style.background = '#f5f5f5';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🔄 Analyze Another
            </button>
            <button 
              onClick={backToGuide}
              style={{
                padding: '14px 20px',
                background: '#f5f5f5',
                color: '#1a1a2e',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => {
                e.target.style.background = '#e0e0e0';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.target.style.background = '#f5f5f5';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ← Back to Skill Gap
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
