  import React, { useState, useEffect, useRef } from 'react';
import API from '../apiBase.js';
import { trackRoadmapGeneration } from '../utils/activityTracker.js';
import jsPDF from 'jspdf';

export default function CareerRoadmapGenerator({ onBack }) {
  const [jobRole, setJobRole] = useState('');
  const [interestArea, setInterestArea] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [duration, setDuration] = useState(6);
  const [frequency, setFrequency] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState('');
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [completedPhases, setCompletedPhases] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const roadmapRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const styles = {
    '@keyframes fadeInUp': {
      from: { opacity: 0, transform: 'translateY(30px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
    '@keyframes slideInRight': {
      from: { opacity: 0, transform: 'translateX(-20px)' },
      to: { opacity: 1, transform: 'translateX(0)' }
    },
    '@keyframes pulse': {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' }
    },
    '@keyframes shimmer': {
      '0%': { backgroundPosition: '-1000px 0' },
      '100%': { backgroundPosition: '1000px 0' }
    }
  };

  const togglePhase = (idx) => {
    setExpandedPhase(expandedPhase === idx ? null : idx);
  };

  const markPhaseComplete = (idx) => {
    setCompletedPhases(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  async function generateRoadmap() {
    setError('');
    setRoadmap(null);

    if (!jobRole.trim()) {
      setError('⚠️ Please enter a target job role');
      return;
    }
    if (!interestArea.trim()) {
      setError('⚠️ Please enter your area of interest');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/analyze/career-roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobRole, interestArea, experienceLevel, duration: parseInt(duration), frequency })
      });

      const data = await res.json();
      if (!data.ok) {
        setError(data.error || '⚠️ Failed to generate roadmap');
        setLoading(false);
        return;
      }

      setRoadmap(data.roadmap);
      trackRoadmapGeneration(jobRole);
    } catch (err) {
      setError(err.message || '⚠️ Network error');
    }
    setLoading(false);
  }

  function downloadRoadmap() {
    if (!roadmap) return;
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
    addText(`CAREER ROADMAP: ${roadmap.roadmapTitle}`, 18, true, [0, 180, 168]);
    y += 5;

    // Roadmap Details
    addText(`Target Role: ${roadmap.targetRole}`, 12, true);
    addText(`Interest Area: ${roadmap.interestFocus}`, 11);
    addText(`Duration: ${roadmap.duration}`, 11);
    addText(`Theme: ${roadmap.roadmapTheme}`, 11);
    y += 5;

    // Phases
    addText('YOUR JOURNEY', 16, true, [0, 0, 0]);
    roadmap.phases.forEach((phase, idx) => {
      addText(`${idx + 1}. ${phase.phase.toUpperCase()}`, 14, true, [0, 180, 168]);
      
      addText('Skills to Learn:', 12, true);
      phase.skillsToLearn.forEach(skill => {
        addText(`• ${skill}`, 10);
      });
      y += 2;

      addText('Projects to Build:', 12, true);
      phase.projectsToBuild.forEach(proj => {
        addText(`• ${proj}`, 10);
      });
      y += 2;

      addText(`Outcome: ${phase.outcome}`, 11);
      addText(`Salary Milestone: ${phase.salaryMilestone}`, 11, true, [40, 167, 69]);
      y += 5;
    });

    // Final Outcome
    addText('FINAL OUTCOME', 16, true, [0, 0, 0]);
    addText(`Career Readiness: ${roadmap.finalOutcome.careerReadiness}`, 11);
    addText(`Confidence Level: ${roadmap.finalOutcome.confidenceLevel}`, 11);
    addText(`Estimated Final Salary: ${roadmap.finalOutcome.estimatedFinalSalaryRange}`, 11, true, [40, 167, 69]);
    addText(`Next Steps: ${roadmap.finalOutcome.nextSteps}`, 11);
    y += 5;

    // Disclaimer
    addText('DISCLAIMER', 14, true, [0, 0, 0]);
    addText(roadmap.disclaimer, 9);

    // Save PDF
    doc.save(`career_roadmap_${jobRole.replace(/\s+/g, '_')}.pdf`);
  }

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #f8fffe 0%, #ffffff 50%, #e8f8f6 100%)', 
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      padding: '40px 20px'
    }}>
      {/* Animated Background Particles */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.1,
        background: `
          radial-gradient(circle at 20% 50%, white 2px, transparent 2px),
          radial-gradient(circle at 80% 80%, white 2px, transparent 2px),
          radial-gradient(circle at 40% 20%, white 1px, transparent 1px),
          radial-gradient(circle at 90% 30%, white 1px, transparent 1px),
          radial-gradient(circle at 10% 90%, white 1px, transparent 1px)
        `,
        backgroundSize: '200px 200px, 150px 150px, 100px 100px, 180px 180px, 220px 220px',
        animation: 'float 20s infinite linear'
      }}></div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 180, 168, 0.5), 0 0 40px rgba(29, 181, 132, 0.3); }
          50% { box-shadow: 0 0 30px rgba(0, 180, 168, 0.8), 0 0 60px rgba(29, 181, 132, 0.5); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .phase-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .phase-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .skill-item {
          animation: slideInRight 0.5s ease-out backwards;
        }
        .progress-bar {
          transition: width 1s ease-out;
        }
      `}</style>

      {!roadmap ? (
        <div style={{
          padding: '0',
          width: '100%',
          position: 'relative',
          zIndex: 1,
          animation: 'fadeInUp 0.8s ease-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <div className="glass-effect" style={{
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0, 180, 168, 0.15)',
          padding: '50px 40px',
          animation: 'glow 3s infinite',
          width: '100%',
          margin: '0 auto'
        }}>
          {/* Hero Section */}
          <div style={{ marginBottom: 48, textAlign: 'center' }}>
            <div style={{ 
              fontSize: '72px', 
              marginBottom: '16px',
              animation: 'bounce 2s infinite'
            }}>🚀</div>
            <h1 style={{ 
              fontSize: '42px', 
              margin: '0 0 16px 0', 
              background: 'linear-gradient(135deg, #00B4A8 0%, #1DB584 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '900',
              letterSpacing: '-1px'
            }}>Career Roadmap Generator</h1>
            <p style={{ 
              fontSize: '18px', 
              color: '#666', 
              margin: 0, 
              lineHeight: 1.8
            }}>
              Unlock your potential with an AI-powered, personalized career roadmap. 
              Chart your path to success with precision and confidence! ✨
            </p>
          </div>

          {/* Form Grid - Vertical Stack */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px', marginBottom: 32 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 12 }}>
                <strong style={{ 
                  fontSize: '16px', 
                  color: '#1a1a2e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>🎯</span> Target Job Role
                </strong>
                <small style={{ 
                  display: 'block', 
                  color: '#999', 
                  marginTop: 6, 
                  fontSize: '13px',
                  fontStyle: 'italic'
                }}>Where do you see yourself?</small>
              </label>
              <input
                type="text"
                placeholder="e.g., Senior React Developer, AI Engineer"
                value={jobRole}
                onChange={e => setJobRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  borderRadius: '14px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#00B4A8';
                  e.target.style.boxShadow = '0 0 0 4px rgba(0, 180, 168, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 12 }}>
                <strong style={{ 
                  fontSize: '16px', 
                  color: '#1a1a2e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>💡</span> Area of Interest
                </strong>
                <small style={{ 
                  display: 'block', 
                  color: '#999', 
                  marginTop: 6, 
                  fontSize: '13px',
                  fontStyle: 'italic'
                }}>What excites you most?</small>
              </label>
              <input
                type="text"
                placeholder="e.g., AI/ML, Web3, Cloud Computing"
                value={interestArea}
                onChange={e => setInterestArea(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  borderRadius: '14px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#00B4A8';
                  e.target.style.boxShadow = '0 0 0 4px rgba(0, 180, 168, 0.1)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 12 }}>
                <strong style={{ 
                  fontSize: '16px', 
                  color: '#1a1a2e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>📊</span> Experience Level
                </strong>
              </label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  borderRadius: '14px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxSizing: 'border-box'
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
                <option value="Beginner">🌱 Beginner (Fresh / 0-1 years)</option>
                <option value="Intermediate">🌿 Intermediate (1-3 years)</option>
                <option value="Advanced">🌳 Advanced (3+ years)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 12 }}>
                <strong style={{ 
                  fontSize: '16px', 
                  color: '#1a1a2e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>⏰</span> Roadmap Duration
                </strong>
              </label>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  borderRadius: '14px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxSizing: 'border-box'
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
                <option value="1">⚡ 1 Month (Quick Start)</option>
                <option value="3">🚀 3 Months</option>
                <option value="6">🎯 6 Months (Recommended)</option>
                <option value="12">🏆 12 Months (Deep Dive)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 12 }}>
                <strong style={{ 
                  fontSize: '16px', 
                  color: '#1a1a2e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>📅</span> Update Frequency
                </strong>
                <small style={{ 
                  display: 'block', 
                  color: '#999', 
                  marginTop: 6, 
                  fontSize: '13px',
                  fontStyle: 'italic'
                }}>How often should your roadmap be updated?</small>
              </label>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  borderRadius: '14px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxSizing: 'border-box'
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
                <option value="weekly">📆 Weekly Updates</option>
                <option value="monthly">🗓️ Monthly Updates</option>
              </select>
            </div>
          </div>

          {error && <div style={{
            marginBottom: 28,
            color: '#d32f2f',
            background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
            padding: '18px 20px',
            borderRadius: '14px',
            border: '2px solid #ef5350',
            fontSize: '15px',
            fontWeight: '600',
            animation: 'pulse 1s ease-in-out'
          }}>
            {error}
          </div>}

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={generateRoadmap}
              disabled={loading}
              style={{
                background: loading ? '#ccc' : 'linear-gradient(135deg, #00B4A8 0%, #1DB584 100%)',
                color: 'white',
                padding: '18px 48px',
                fontSize: '17px',
                fontWeight: 'bold',
                borderRadius: '14px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: loading ? 'none' : '0 10px 30px rgba(0, 180, 168, 0.4)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => !loading && (
                e.target.style.transform = 'translateY(-3px) scale(1.05)',
                e.target.style.boxShadow = '0 15px 40px rgba(0, 180, 168, 0.5)'
              )}
              onMouseLeave={e => !loading && (
                e.target.style.transform = 'translateY(0) scale(1)',
                e.target.style.boxShadow = '0 10px 30px rgba(0, 180, 168, 0.4)'
              )}
            >
              {loading ? '✨ Crafting Your Future...' : '🎯 Generate My Roadmap'}
            </button>
          </div>
        </div>
        </div>
      ) : (
        <div ref={roadmapRef} style={{ 
          padding: '0px', 
          width: '100%',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Header with glassmorphism */}
          <div className="glass-effect" style={{
            borderRadius: '0px',
            boxShadow: 'none',
            overflow: 'hidden',
            marginBottom: 0,
            animation: 'fadeInUp 0.6s ease-out',
            width: '100%'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #00B4A8 0%, #1DB584 100%)',
              color: 'white',
              padding: '48px 50px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-10%',
                width: '400px',
                height: '400px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(60px)'
              }}></div>
              <div style={{ 
                position: 'relative', 
                zIndex: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
                  <h1 style={{ fontSize: '36px', margin: 0, fontWeight: '900', letterSpacing: '-0.5px' }}>
                    {roadmap.roadmapTitle}
                  </h1>
                  <p style={{ margin: '12px 0 0 0', fontSize: '16px', opacity: 0.9 }}>
                    Your personalized journey to success
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div style={{ padding: '30px 40px', background: 'white', width: '100%' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px'
              }}>
                {[
                  { icon: '🎯', label: 'Target Role', value: roadmap.targetRole, color: '#00B4A8' },
                  { icon: '💡', label: 'Focus Area', value: roadmap.interestFocus, color: '#1DB584' },
                  { icon: '⏰', label: 'Duration', value: roadmap.duration, color: '#00838f' },
                  { icon: '🎨', label: 'Theme', value: roadmap.roadmapTheme, color: '#00B4A8' }
                ].map((stat, idx) => (
                  <div key={idx} style={{
                    padding: '24px',
                    background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                    borderRadius: '16px',
                    borderLeft: `4px solid ${stat.color}`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    animation: `slideInRight ${0.5 + idx * 0.1}s ease-out`
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 24px ${stat.color}30`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                    <p style={{ 
                      margin: '0 0 8px 0', 
                      fontSize: '12px', 
                      color: '#555', 
                      textTransform: 'uppercase', 
                      fontWeight: '700',
                      letterSpacing: '1px'
                    }}>{stat.label}</p>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '16px', 
                      color: stat.color, 
                      fontWeight: '700' 
                    }}>{stat.value}</p>
                  </div>
                ))}
              </div>
              
              {/* Progress Overview */}
              <div style={{ marginTop: '32px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '12px',
                  alignItems: 'center'
                }}>
                  <strong style={{ fontSize: '15px', color: '#1a1a1a' }}>
                    Overall Progress
                  </strong>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '700', 
                    color: '#00B4A8' 
                  }}>
                    {completedPhases.length} / {roadmap.phases.length} Phases
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '12px', 
                  background: '#f0f0f0', 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div className="progress-bar" style={{ 
                    width: `${(completedPhases.length / roadmap.phases.length) * 100}%`,
                    height: '100%', 
                    background: 'linear-gradient(90deg, #00B4A8 0%, #1DB584 100%)',
                    borderRadius: '12px',
                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Journey Phases */}
          <div style={{ 
            width: '100%', 
            margin: '0 auto 32px',
            animation: 'fadeInUp 0.8s ease-out',
            padding: '0 40px'
          }}>
            <h2 style={{ 
              fontSize: '32px', 
              background: 'linear-gradient(135deg, #00B4A8 0%, #1DB584 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginTop: 0, 
              marginBottom: 32,
              textAlign: 'center',
              fontWeight: '900'
            }}>
              📈 Your Career Journey
            </h2>
            
            <div style={{ position: 'relative' }}>
              {/* Timeline Line */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '0',
                bottom: '0',
                width: '4px',
                background: 'linear-gradient(180deg, #00B4A8 0%, #1DB584 50%, #00838f 100%)',
                transform: 'translateX(-50%)',
                zIndex: 0,
                borderRadius: '4px'
              }}></div>

              {roadmap.phases.map((phase, idx) => {
                const isExpanded = expandedPhase === idx;
                const isCompleted = completedPhases.includes(idx);
                const isLeft = idx % 2 === 0;
                
                return (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: isLeft ? 'flex-start' : 'flex-end',
                    marginBottom: '48px',
                    position: 'relative',
                    animation: `fadeInUp ${0.8 + idx * 0.2}s ease-out`
                  }}>
                    {/* Timeline Node */}
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: '24px',
                      transform: 'translateX(-50%)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: isCompleted 
                        ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                        : 'linear-gradient(135deg, #00B4A8 0%, #1DB584 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: 'white',
                      fontWeight: 'bold',
                      zIndex: 2,
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '4px solid rgba(255, 255, 255, 0.9)'
                    }}
                    onClick={() => markPhaseComplete(idx)}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateX(-50%) scale(1.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
                    }}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>

                    {/* Phase Card */}
                    <div className="phase-card glass-effect" style={{
                      width: 'calc(50% - 60px)',
                      padding: '32px',
                      borderRadius: '20px',
                      boxShadow: '0 15px 45px rgba(0, 0, 0, 0.2)',
                      cursor: 'pointer',
                      border: isCompleted 
                        ? '3px solid #4caf50'
                        : '3px solid rgba(0, 180, 168, 0.3)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={() => togglePhase(idx)}>
                      {/* Corner Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        padding: '6px 14px',
                        background: isCompleted 
                          ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                          : 'linear-gradient(135deg, #00B4A8 0%, #1DB584 100%)',
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                      }}>
                        {isCompleted ? '✓ Done' : 'Phase ' + (idx + 1)}
                      </div>

                      <h3 style={{ 
                        marginTop: 0, 
                        marginBottom: 20, 
                        background: 'linear-gradient(135deg, #00B4A8 0%, #1DB584 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '24px', 
                        fontWeight: '900',
                        letterSpacing: '-0.5px',
                        paddingRight: '100px'
                      }}>
                        {phase.phase}
                      </h3>

                      {/* Animated expand/collapse indicator */}
                      <div style={{
                        position: 'absolute',
                        bottom: '16px',
                        left: '50%',
                        transform: `translateX(-50%) rotate(${isExpanded ? '180deg' : '0deg'})`,
                        fontSize: '24px',
                        transition: 'transform 0.3s ease',
                        color: '#00B4A8'
                      }}>
                        ▼
                      </div>

                      {isExpanded && (
                        <div style={{
                          animation: 'fadeInUp 0.4s ease-out',
                          paddingBottom: '32px'
                        }}>
                          {/* Skills Section */}
                          <div style={{ marginBottom: 24 }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              marginBottom: 16
                            }}>
                              <span style={{ fontSize: '24px' }}>📚</span>
                              <strong style={{ 
                                fontSize: '16px', 
                                color: '#1a1a1a',
                                fontWeight: '800'
                              }}>Skills to Master</strong>
                            </div>
                            <div style={{ 
                              display: 'flex', 
                              flexWrap: 'wrap', 
                              gap: '10px' 
                            }}>
                              {phase.skillsToLearn.map((skill, i) => (
                                <div key={i} className="skill-item" style={{ 
                                  padding: '10px 18px',
                                  background: 'linear-gradient(135deg, #e0f9f7 0%, #e8f7f4 100%)',
                                  borderRadius: '20px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#008A7C',
                                  border: '2px solid #00B4A850',
                                  animationDelay: `${i * 0.05}s`,
                                  transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.background = 'linear-gradient(135deg, #00B4A8 0%, #1DB584 100%)';
                                  e.currentTarget.style.color = 'white';
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.background = 'linear-gradient(135deg, #e0f9f7 0%, #e8f7f4 100%)';
                                  e.currentTarget.style.color = '#008A7C';
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}>
                                  ✓ {skill}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Projects Section */}
                          <div style={{ marginBottom: 24 }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              marginBottom: 16
                            }}>
                              <span style={{ fontSize: '24px' }}>🛠️</span>
                              <strong style={{ 
                                fontSize: '16px', 
                                color: '#1a1a1a',
                                fontWeight: '800'
                              }}>Build These Projects</strong>
                            </div>
                            <div style={{ paddingLeft: 0 }}>
                              {phase.projectsToBuild.map((proj, i) => (
                                <div key={i} style={{ 
                                  marginBottom: 12,
                                  padding: '14px 18px',
                                  background: 'linear-gradient(135deg, #f0fdf9 0%, #e6f7f3 100%)',
                                  borderRadius: '12px',
                                  fontSize: '14px',
                                  color: '#1a1a1a',
                                  borderLeft: '4px solid #1DB584',
                                  transition: 'all 0.3s ease',
                                  fontWeight: '600'
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.transform = 'translateX(8px)';
                                  e.currentTarget.style.borderLeftWidth = '6px';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.transform = 'translateX(0)';
                                  e.currentTarget.style.borderLeftWidth = '4px';
                                }}>
                                  → {proj}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Outcome */}
                          <div style={{ 
                            marginBottom: 20, 
                            padding: '20px', 
                            background: 'linear-gradient(135deg, #fff8f0 0%, #ffe6cc 100%)', 
                            borderRadius: '14px',
                            border: '2px solid #ffa726'
                          }}>
                            <strong style={{ 
                              fontSize: '14px', 
                              color: '#e65100', 
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: 12,
                              fontWeight: '800'
                            }}>
                              <span style={{ fontSize: '20px' }}>🎯</span> Expected Outcome
                            </strong>
                            <p style={{ 
                              margin: 0, 
                              color: '#555', 
                              fontSize: '14px', 
                              lineHeight: 1.8,
                              fontWeight: '500'
                            }}>{phase.outcome}</p>
                          </div>

                          {/* Salary Milestone */}
                          <div style={{ 
                            padding: '20px', 
                            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', 
                            borderRadius: '14px',
                            border: '2px solid #4caf50',
                            textAlign: 'center'
                          }}>
                            <strong style={{ 
                              fontSize: '14px', 
                              color: '#2e7d32', 
                              display: 'block', 
                              marginBottom: 10,
                              fontWeight: '800',
                              textTransform: 'uppercase',
                              letterSpacing: '1px'
                            }}>💰 Salary Milestone</strong>
                            <p style={{ 
                              margin: 0, 
                              color: '#2e7d32', 
                              fontSize: '20px', 
                              fontWeight: '900'
                            }}>{phase.salaryMilestone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Final Outcome Section */}
          <div className="glass-effect" style={{
            borderRadius: '0px',
            boxShadow: 'none',
            padding: '40px 40px',
            marginBottom: 0,
            width: '100%',
            margin: '0',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
            border: 'none',
            animation: 'fadeInUp 1s ease-out',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              background: 'linear-gradient(135deg, #00B4A8 0%, #1DB584 100%)',
              borderRadius: '50%',
              opacity: 0.1,
              filter: 'blur(40px)'
            }}></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'pulse 2s infinite' }}>🏆</div>
                <h2 style={{ 
                  marginTop: 0, 
                  marginBottom: 16, 
                  background: 'linear-gradient(135deg, #00B4A8 0%, #1DB584 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '36px',
                  fontWeight: '900',
                  letterSpacing: '-0.5px'
                }}>
                  Your Destination
                </h2>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#666', 
                  margin: 0
                }}>
                  Here's what you'll achieve after completing this journey
                </p>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: 32
              }}>
                <div style={{
                  padding: '28px',
                  background: 'linear-gradient(135deg, #e8f8f6 0%, #f5fffe 100%)',
                  borderRadius: '18px',
                  border: '2px solid #00B4A8',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 180, 168, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎓</div>
                  <strong style={{ 
                    fontSize: '14px', 
                    color: '#00838f', 
                    display: 'block', 
                    marginBottom: 14,
                    textTransform: 'uppercase',
                    fontWeight: '800',
                    letterSpacing: '1px'
                  }}>Career Readiness</strong>
                  <p style={{ 
                    margin: 0, 
                    color: '#424242', 
                    fontSize: '15px', 
                    lineHeight: 1.7,
                    fontWeight: '500'
                  }}>{roadmap.finalOutcome.careerReadiness}</p>
                </div>
                
                <div style={{
                  padding: '28px',
                  background: 'linear-gradient(135deg, #e8f8f6 0%, #f5fffe 100%)',
                  borderRadius: '18px',
                  border: '2px solid #1DB584',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(29, 181, 132, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>💪</div>
                  <strong style={{ 
                    fontSize: '14px', 
                    color: '#1DB584', 
                    display: 'block', 
                    marginBottom: 14,
                    textTransform: 'uppercase',
                    fontWeight: '800',
                    letterSpacing: '1px'
                  }}>Confidence Level</strong>
                  <p style={{ 
                    margin: 0, 
                    color: '#1DB584', 
                    fontSize: '24px', 
                    fontWeight: '900'
                  }}>{roadmap.finalOutcome.confidenceLevel}</p>
                </div>
                
                <div style={{
                  padding: '28px',
                  background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                  borderRadius: '18px',
                  border: '2px solid #4caf50',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(76, 175, 80, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>💰</div>
                  <strong style={{ 
                    fontSize: '14px', 
                    color: '#2e7d32', 
                    display: 'block', 
                    marginBottom: 14,
                    textTransform: 'uppercase',
                    fontWeight: '800',
                    letterSpacing: '1px'
                  }}>Estimated Salary</strong>
                  <p style={{ 
                    margin: 0, 
                    color: '#2e7d32', 
                    fontSize: '24px', 
                    fontWeight: '900'
                  }}>{roadmap.finalOutcome.estimatedFinalSalaryRange}</p>
                </div>
              </div>
              
              <div style={{ 
                padding: '28px', 
                background: 'linear-gradient(135deg, #e8f8f6 0%, #f5fffe 100%)', 
                borderRadius: '18px',
                border: '2px solid #00B4A8'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: 16
                }}>
                  <span style={{ fontSize: '32px' }}>🚀</span>
                  <strong style={{ 
                    fontSize: '16px', 
                    color: '#00838f',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>Next Steps</strong>
                </div>
                <p style={{ 
                  margin: 0, 
                  color: '#424242', 
                  fontSize: '15px', 
                  lineHeight: 1.8,
                  fontWeight: '500'
                }}>{roadmap.finalOutcome.nextSteps}</p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="glass-effect" style={{
            borderRadius: '18px',
            boxShadow: '0 10px 30px rgba(0, 180, 168, 0.15)',
            padding: '24px 32px',
            marginBottom: 32,
            margin: '0 auto 32px',
            borderLeft: '5px solid #00B4A8',
            animation: 'fadeInUp 1.2s ease-out'
          }}>
            <strong style={{ 
              fontSize: '13px', 
              color: '#666', 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: 14, 
              textTransform: 'uppercase',
              fontWeight: '800',
              letterSpacing: '1px'
            }}>
              <span style={{ fontSize: '18px' }}>📝</span> Important Disclaimer
            </strong>
            <p style={{ 
              margin: 0, 
              color: '#666', 
              fontSize: '14px', 
              lineHeight: 1.7,
              fontStyle: 'italic'
            }}>{roadmap.disclaimer}</p>
          </div>

          {/* Action Buttons */}
          <div className="glass-effect" style={{
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0, 180, 168, 0.15)',
            padding: '40px',
            textAlign: 'center',
            margin: '0 auto',
            animation: 'fadeInUp 1.4s ease-out'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ 
                fontSize: '24px', 
                margin: '0 0 12px 0',
                background: 'linear-gradient(135deg, #00B4A8 0%, #1DB584 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '900'
              }}>
                Ready to Begin Your Journey?
              </h3>
              <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
                Download your roadmap or create a new one
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={downloadRoadmap}
                style={{
                  background: 'linear-gradient(135deg, #00B4A8 0%, #1DB584 100%)',
                  color: 'white',
                  padding: '18px 48px',
                  fontSize: '17px',
                  fontWeight: 'bold',
                  borderRadius: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(0, 180, 168, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.boxShadow = '0 15px 40px rgba(0, 180, 168, 0.5)';
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 10px 30px rgba(0, 180, 168, 0.4)';
                }}
              >
                <span style={{ fontSize: '24px' }}>⬇️</span>
                <span>Download Roadmap</span>
              </button>
              <button
                onClick={() => {
                  setRoadmap(null);
                  setCompletedPhases([]);
                  setExpandedPhase(null);
                }}
                style={{
                  background: 'linear-gradient(135deg, #e8f8f6 0%, #f5fffe 100%)',
                  color: '#00B4A8',
                  padding: '18px 48px',
                  fontSize: '17px',
                  fontWeight: '700',
                  borderRadius: '14px',
                  border: '2px solid #00B4A8',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 10px 30px rgba(0, 180, 168, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.boxShadow = '0 15px 40px rgba(0, 180, 168, 0.3)';
                  e.target.style.background = 'linear-gradient(135deg, #00B4A8 0%, #1DB584 100%)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 10px 30px rgba(0, 180, 168, 0.2)';
                  e.target.style.background = 'linear-gradient(135deg, #e8f8f6 0%, #f5fffe 100%)';
                  e.target.style.color = '#00B4A8';
                }}
              >
                <span style={{ fontSize: '24px' }}>🔄</span>
                <span>Generate Another</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
