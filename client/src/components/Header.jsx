import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';

export default function Header({ user, activeTab, onTabChange, onLogout }) {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: 'home' },
    { id: 'hr-review', label: 'HR Review & ATS', icon: 'fact_check' },
    { id: 'career-roadmap', label: 'Career Roadmap', icon: 'map' },
    { id: 'skill-gap', label: 'Skill Gap', icon: 'insights' },
    { id: 'profile', label: 'Profile', icon: 'account_circle' },
  ];

  const [googleMode, setGoogleMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('googleMode') === 'on';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('google-mode', googleMode);
    document.body.classList.toggle('google-mode', googleMode);
    localStorage.setItem('googleMode', googleMode ? 'on' : 'off');
  }, [googleMode]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>CareerLens</h1>
          <p className={styles.subtitle}>AI-Powered Career Intelligence Platform</p>
        </div>

        <nav className={styles.nav}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.navButton} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => onTabChange(tab.id)}
              title={tab.label}
            >
              <span className={`${styles.icon} materialIcon`}>{tab.icon}</span>
              <span className={styles.label}>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.rightSection}>
          <div className={styles.toggleGroup}>
            <span className={styles.modeLabel}>Google design</span>
            <button
              className={`${styles.modeToggle} ${googleMode ? styles.modeOn : ''}`}
              onClick={() => setGoogleMode((prev) => !prev)}
              aria-pressed={googleMode}
            >
              <span className={styles.toggleThumb} />
              <span className={styles.toggleText}>{googleMode ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
