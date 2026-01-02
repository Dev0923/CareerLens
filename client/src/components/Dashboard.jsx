import React, { useEffect, useRef, useState } from 'react';
import styles from './Dashboard.module.css';

export default function Dashboard({ user, onNavigateTo }) {
  const [selectedMember, setSelectedMember] = useState(0);
  const [chartsLoaded, setChartsLoaded] = useState(false);
  const atsChartRef = useRef(null);
  const skillChartRef = useRef(null);
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const features = [
    {
      id: 'hr-review',
      title: 'HR Review & ATS Score',
      icon: 'fact_check',
      description: 'Get detailed HR feedback and ATS compatibility analysis for your resume against job descriptions.',
      gradient: 'linear-gradient(135deg, #00B4A8 0%, #1DB584 50%, #b8a6d8 100%)'
    },
    {
      id: 'skill-gap',
      title: 'Skill Gap Analysis',
      icon: 'insights',
      description: 'Identify missing skills, understand salary impact, and get personalized recommendations.',
      gradient: 'linear-gradient(135deg, #d8a8e0 0%, #c299d4 50%, #00B4A8 100%)'
    },
    {
      id: 'career-roadmap',
      title: 'Career Roadmap',
      icon: 'map',
      description: 'Visualize your career path with AI-generated roadmaps tailored to your goals.',
      gradient: 'linear-gradient(135deg, #1DB584 0%, #00B4A8 50%, #d4c9e0 100%)'
    },
    {
      id: 'profile',
      title: 'My Profile',
      icon: 'account_circle',
      description: 'View and manage your profile information and settings.',
      gradient: 'linear-gradient(135deg, #b8a6d8 0%, #d8a8e0 50%, #1DB584 100%)'
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Sakshi Sharma',
      role: 'Frontend Developer',
      avatar: '👩‍💼',
      image: '/Sakshi-sharma%20.jpg',
      bio: 'Passionate about building clean, responsive, and user-centric interfaces. Focused on crafting smooth login experiences, intuitive layouts, and modern animations that enhance usability and visual appeal. Believes great design is where creativity meets performance.',
      social: { insta: 'https://www.instagram.com/saakshhi_sh/', linkedin: 'https://www.linkedin.com/in/sakshi-sharma-5aa9642a6/', github: 'https://github.com/Sakshi2095' }
    },
    {
      id: 2,
      name: 'Dev',
      role: 'Backend Developer',
      avatar: '👨‍💻',
      image: '/Dev.jpg',
      bio: 'Dedicated to developing secure, scalable, and efficient server-side systems. Skilled in authentication, API design, and database management to ensure seamless data flow and reliable application performance. Strong believer in clean architecture and robust logic.',
      social: { insta: 'https://www.instagram.com/dev._in.motion/', linkedin: 'https://www.linkedin.com/in/onlydev0923/', github: 'https://github.com/Dev0923' }
    },
    {
      id: 3,
      name: 'Pratham Pareek',
      role: 'AI Specialist',
      avatar: '👨‍🔬',
      image: '/pratham-pareek%20.jpg',
      bio: 'Driven by applying AI to solve real-world problems. Specializes in resume parsing, ATS scoring, and intelligent feedback generation using NLP and machine learning techniques. Aims to make career insights smarter, faster, and more accessible.',
      social: { insta: 'https://www.instagram.com/pra.tham_._?utm_source=qr&igsh=MWV6a3lwZ3ZqMTk2eg==', linkedin: 'https://www.linkedin.com/in/pratham-pareek-93449b381/', github: 'https://github.com/Pratham-deploy' }
    }
  ];

  useEffect(() => {
    const loadCharts = () => {
      if (window.google && window.google.charts) {
        window.google.charts.load('current', { packages: ['corechart'] });
        window.google.charts.setOnLoadCallback(() => setChartsLoaded(true));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/charts/loader.js';
      script.async = true;
      script.onload = () => {
        window.google.charts.load('current', { packages: ['corechart'] });
        window.google.charts.setOnLoadCallback(() => setChartsLoaded(true));
      };
      document.head.appendChild(script);
    };
    loadCharts();
  }, []);

  useEffect(() => {
    if (!chartsLoaded || !window.google || !window.google.visualization) return;

    // ATS score distribution
    if (atsChartRef.current) {
      const data = window.google.visualization.arrayToDataTable([
        ['Range', 'Users'],
        ['90-100', 18],
        ['80-89', 26],
        ['70-79', 22],
        ['60-69', 16],
        ['<60', 9],
      ]);
      const options = {
        title: 'ATS Score Distribution',
        backgroundColor: 'transparent',
        legend: { position: 'none' },
        colors: ['#6750a4'],
        hAxis: { textStyle: { color: '#49454f' } },
        vAxis: { minValue: 0, textStyle: { color: '#49454f' } },
        titleTextStyle: { color: '#1d192b', fontSize: 14, bold: true },
        chartArea: { width: '80%', height: '70%' },
        bar: { groupWidth: '55%' },
      };
      const chart = new window.google.visualization.ColumnChart(atsChartRef.current);
      chart.draw(data, options);
    }

    // Skill progress donut
    if (skillChartRef.current) {
      const data = window.google.visualization.arrayToDataTable([
        ['Skill', 'Progress'],
        ['AI/ML', 32],
        ['Cloud/GCP', 24],
        ['Frontend', 18],
        ['Backend', 14],
        ['Soft Skills', 12],
      ]);
      const options = {
        title: 'Skill Progress (sample)',
        pieHole: 0.55,
        backgroundColor: 'transparent',
        colors: ['#6750a4', '#d0bcff', '#00B4A8', '#1DB584', '#c299d4'],
        legend: { position: 'right', textStyle: { color: '#49454f' } },
        pieSliceTextStyle: { color: '#1d192b', fontSize: 12 },
        titleTextStyle: { color: '#1d192b', fontSize: 14, bold: true },
        chartArea: { width: '85%', height: '75%' },
      };
      const chart = new window.google.visualization.PieChart(skillChartRef.current);
      chart.draw(data, options);
    }
  }, [chartsLoaded]);

  return (
    <div className={styles.dashboard}>

      <div className={styles.aboutSection}>
        <div className={styles.aboutImagesContainer}>
          <div className={styles.imageLayout}>
            <img src="/Free Resume Review _ Resume Professional Writers.jpg" alt="Resume Review" className={styles.imageLarge} />
            <img src="/Time To Change Careers_ How To Make Your Career Transition Smooth And Painless.jpg" alt="Career Transition" className={styles.imageSmall} />
          </div>
          <img 
            src="/Appraisals pay hikes see a dip for senior personnel in manufacturing, but roles involving smart t___.jpg" 
            alt="Career Insights" 
            className={styles.statsBox}
          />
        </div>
        <div className={styles.aboutContent}>
          
          <h3 className={styles.aboutTitle}>PLATFORM OVERVIEW</h3>
          <p className={styles.aboutText}>
            CareerLens is a career intelligence platform designed to support students and professionals in navigating today's competitive job market. The platform evaluates resumes through automated ATS analysis and HR-style review to highlight strengths, uncover weaknesses, and improve overall resume quality.
          </p>
          <p className={styles.aboutText}>
            Beyond scoring, CareerLens goes a step further by identifying role-specific skill gaps and delivering actionable career roadmaps. This ensures users not only understand where they stand but also know exactly what steps to take next to progress toward their target roles.
          </p>
          <p className={styles.aboutText}>
            By combining resume optimization, skill gap analysis, and career planning in one place, CareerLens transforms resumes into strategic career tools rather than static documents.
          </p>
          <div className={styles.aboutActions}>
            <button className={styles.aboutButtonPrimary} onClick={() => scrollToSection('features')}>
              Our Features
            </button>
            <button className={styles.aboutButtonSecondary} onClick={() => scrollToSection('team')}>
              Team Member 
            </button>
          </div>
        </div>
      </div>

      <div className={styles.featuresSection} id="features">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>OUR FEATURES</h2>
        </div>
        <div className={styles.glassyGrid}>
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={styles.glassyCard}
              onClick={() => onNavigateTo(feature.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.glassyContent}>
                <div className={`${styles.featureIconLarge} materialIcon`}>{feature.icon}</div>
                <h3 className={styles.glassyTitle}>{feature.title}</h3>
                <p className={styles.glassyBio}>{feature.description}</p>
              </div>
              <div className={styles.glassyGloss}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Google Charts section */}
      <div className={styles.featuresSection} id="charts" style={{ marginTop: '24px' }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>LIVE INSIGHTS (GOOGLE CHARTS)</h2>
          <p className={styles.sectionSubtitle}>Powered by Google Charts — sample ATS and skills insights</p>
        </div>
        <div className={styles.glassyGrid}>
          <div className={styles.glassyCard} style={{ minHeight: '320px' }}>
            <div className={styles.glassyContent}>
              <h3 className={styles.glassyTitle}>ATS Score Distribution</h3>
              <div ref={atsChartRef} style={{ width: '100%', height: '240px' }} />
            </div>
          </div>
          <div className={styles.glassyCard} style={{ minHeight: '320px' }}>
            <div className={styles.glassyContent}>
              <h3 className={styles.glassyTitle}>Skill Progress (Sample)</h3>
              <div ref={skillChartRef} style={{ width: '100%', height: '240px' }} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.teamIntro}>
        <h2 className={styles.teamIntroTitle}>Introducing Our Team</h2>
        <p className={styles.teamIntroSubtitle}>
          Meet our exceptional team—diverse talents creating a dynamic force, united by shared values and a commitment to excellence.
        </p>
      </div>

      <div className={styles.teamSection} id="team">
        <div 
          className={styles.teamBackground} 
          style={{ backgroundImage: `url(${teamMembers[selectedMember].image})` }}
        ></div>
        <div className={styles.teamOverlay}></div>
        
        <div className={styles.teamContent}>
          <h1 className={styles.teamMainTitle}>{teamMembers[selectedMember].name.toUpperCase()}</h1>


          <div className={styles.teamAvatars}>
            {teamMembers.map((member, index) => (
              <button
                key={member.id}
                className={`${styles.teamAvatar} ${selectedMember === index ? styles.teamAvatarActive : ''}`}
                onClick={() => setSelectedMember(index)}
                title={member.name}
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  className={styles.teamAvatarImage}
                />
              </button>
            ))}
          </div>
          
          <div className={styles.memberCard}>
            <div className={styles.memberCardAvatar}>
              <img
                src={teamMembers[selectedMember].image}
                alt={teamMembers[selectedMember].name}
                className={styles.memberCardAvatarImage}
              />
            </div>
            <h3 className={styles.memberCardName}>{teamMembers[selectedMember].name}</h3>
            <p className={styles.memberCardRole}>{teamMembers[selectedMember].role}</p>
            <p className={styles.memberCardBio}>{teamMembers[selectedMember].bio}</p>
            <div className={styles.socialIcons}>
              <a href={teamMembers[selectedMember].social.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} title="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href={teamMembers[selectedMember].social.github} target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} title="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href={teamMembers[selectedMember].social.insta} target="_blank" rel="noopener noreferrer" className={styles.socialIconLink} title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
