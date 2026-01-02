import React, { useState } from 'react';
import AnimatedLogin from './components/AnimatedLogin.jsx';
import Analyzer from './components/Analyzer.jsx';
import Dashboard from './components/Dashboard.jsx';
import Header from './components/Header.jsx';
import Profile from './components/Profile.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} onNavigateTo={setActiveTab} />;
      case 'hr-review':
        return <Analyzer user={user} onLogout={handleLogout} />;
      case 'career-roadmap':
        return <Analyzer user={user} onLogout={handleLogout} showRoadmapOnly={true} />;
      case 'skill-gap':
        return <Analyzer user={user} onLogout={handleLogout} showSkillGapOnly={true} />;
      case 'profile':
        return <Profile user={user} onBack={() => setActiveTab('dashboard')} />;
      default:
        return <Dashboard user={user} onNavigateTo={setActiveTab} />;
    }
  };

  return (
    <>
      {user ? (
        <>
          <Header user={user} activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
          <main className="mainContent">
            {renderContent()}
          </main>
          <Footer />
        </>
      ) : (
        <div className="container">
          <AnimatedLogin onAuth={(u) => setUser(u)} />
        </div>
      )}
    </>
  );
}
