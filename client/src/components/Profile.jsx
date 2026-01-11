import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import apiBase from '../apiBase';

export default function Profile({ user, onBack }) {
  const [editMode, setEditMode] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('/profile-page-banner-default.jpg');
  const fileInputRef = React.useRef(null);
  const bannerInputRef = React.useRef(null);
  const [errors, setErrors] = useState({});
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Activity tracking state
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('userActivityStats');
    return saved ? JSON.parse(saved) : {
      resumesAnalyzed: 0,
      analysesCompleted: 0,
      totalATSScore: 0,
      atsScoreCount: 0
    };
  });

  const [activityHistory, setActivityHistory] = useState(() => {
    const saved = localStorage.getItem('userActivityHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [resumeHistory, setResumeHistory] = useState(() => {
    const saved = localStorage.getItem('resumeHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [skillProgress, setSkillProgress] = useState(() => {
    const saved = localStorage.getItem('skillProgress');
    return saved ? JSON.parse(saved) : [];
  });

  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('userBadges');
    return saved ? JSON.parse(saved) : [];
  });

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    targetRole: '',
    experience: '',
    location: '',
    linkedin: '',
    github: ''
  });

  // Load profile data from backend on component mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.username) {
        setLoadingProfile(false);
        return;
      }

      try {
        const response = await fetch(`${apiBase}/api/auth/get-profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: user.username })
        });

        if (response.ok) {
          const data = await response.json();
          const profile = data.profile;
          setProfileData(prev => ({
            ...prev,
            phone: profile.phone || '',
            bio: profile.bio || '',
            targetRole: profile.targetRole || '',
            experience: profile.experience || '',
            location: profile.location || '',
            linkedin: profile.linkedin || '',
            github: profile.github || ''
          }));
          
          // Load profile image if available
          if (profile.profileImage) {
            const src = profile.profileImage.startsWith('/uploads')
              ? `${apiBase}${profile.profileImage}`
              : profile.profileImage;
            setImagePreview(src);
          }
          
          // Load banner image if available
          if (profile.bannerImage) {
            const src = profile.bannerImage.startsWith('/uploads')
              ? `${apiBase}${profile.bannerImage}`
              : profile.bannerImage;
            setBannerPreview(src);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user?.username]);

  // Validation functions
  const isValidLinkedInURL = (url) => {
    if (!url) return true;
    const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[\w\-]+\/?$/;
    return linkedInRegex.test(url);
  };

  const isValidGitHubURL = (url) => {
    if (!url) return true;
    const gitHubRegex = /^https?:\/\/(www\.)?github\.com\/[\w\-]+\/?$/;
    return gitHubRegex.test(url);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setBannerImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerClick = () => {
    if (bannerInputRef.current) {
      bannerInputRef.current.click();
    }
  };

  const handleSave = async () => {
    const newErrors = {};
    
    if (profileData.linkedin && !isValidLinkedInURL(profileData.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn profile URL';
    }
    
    if (profileData.github && !isValidGitHubURL(profileData.github)) {
      newErrors.github = 'Please enter a valid GitHub profile URL';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Save profile data to backend
    try {
      const formData = new FormData();
      
      // Add profile image if selected
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      
      // Add banner image if selected
      if (bannerImage) {
        formData.append('bannerImage', bannerImage);
      }
      
      // Add profile data
      const profileToSave = {
        phone: profileData.phone,
        bio: profileData.bio,
        targetRole: profileData.targetRole,
        experience: profileData.experience,
        location: profileData.location,
        linkedin: profileData.linkedin,
        github: profileData.github
      };
      
      formData.append('username', user?.username);
      formData.append('profileData', JSON.stringify(profileToSave));

      const response = await fetch(`${apiBase}/api/auth/update-profile`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setEditMode(false);
        setErrors({});
        setProfileImage(null);
        setBannerImage(null);
        alert('Profile saved successfully!');
      } else {
        alert('Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile: ' + error.message);
    }
  };

  // Expose functions globally for other components to track activity
  React.useEffect(() => {
    window.updateUserActivity = (type, description, atsScore = null, skillsData = null, resumeName = null) => {
      const timestamp = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Update stats
      setUserStats(prev => {
        const newStats = { ...prev };
        
        if (type === 'resume_analyzed') {
          newStats.resumesAnalyzed += 1;
          newStats.analysesCompleted += 1;
          if (atsScore !== null) {
            newStats.totalATSScore += atsScore;
            newStats.atsScoreCount += 1;
            
            // Add to resume history
            setResumeHistory(prevHistory => {
              const newEntry = {
                id: Date.now(),
                name: resumeName || `Resume ${prevHistory.length + 1}`,
                atsScore,
                timestamp,
                date: new Date().toISOString()
              };
              const updated = [newEntry, ...prevHistory];
              localStorage.setItem('resumeHistory', JSON.stringify(updated));
              return updated;
            });
          }
        } else if (type === 'roadmap_generated') {
          newStats.analysesCompleted += 1;
        } else if (type === 'skill_gap_analyzed') {
          newStats.analysesCompleted += 1;
          
          // Update skill progress
          if (skillsData) {
            setSkillProgress(prevSkills => {
              const updated = [...prevSkills];
              skillsData.forEach(skill => {
                const existing = updated.find(s => s.name === skill.name);
                if (existing) {
                  existing.progress = skill.progress;
                  existing.lastUpdated = timestamp;
                } else {
                  updated.push({
                    name: skill.name,
                    progress: skill.progress,
                    category: skill.category || 'Other',
                    lastUpdated: timestamp
                  });
                }
              });
              localStorage.setItem('skillProgress', JSON.stringify(updated));
              return updated;
            });
          }
        }
        
        // Check and award badges
        checkAndAwardBadges(newStats);
        
        localStorage.setItem('userActivityStats', JSON.stringify(newStats));
        return newStats;
      });

      // Add to activity history
      setActivityHistory(prev => {
        const newActivity = { type, description, timestamp };
        const updated = [newActivity, ...prev];
        localStorage.setItem('userActivityHistory', JSON.stringify(updated));
        return updated;
      });
    };

    return () => {
      delete window.updateUserActivity;
    };
  }, []);

  // Badge checking system
  const checkAndAwardBadges = (stats) => {
    const newBadges = [];
    const badgeDefinitions = [
      { id: 'first_resume', name: 'First Steps', description: 'Analyzed your first resume', icon: '🎯', condition: stats.resumesAnalyzed >= 1 },
      { id: 'five_resumes', name: 'Resume Pro', description: 'Analyzed 5 resumes', icon: '📝', condition: stats.resumesAnalyzed >= 5 },
      { id: 'high_scorer', name: 'High Scorer', description: 'Achieved 90+ ATS score', icon: '⭐', condition: stats.atsScoreCount > 0 && (stats.totalATSScore / stats.atsScoreCount) >= 90 },
      { id: 'perfect_score', name: 'Perfectionist', description: 'Achieved 100% ATS score', icon: '🏆', condition: resumeHistory.some(r => r.atsScore === 100) },
      { id: 'dedicated', name: 'Dedicated', description: 'Completed 10 analyses', icon: '💪', condition: stats.analysesCompleted >= 10 },
      { id: 'career_planner', name: 'Career Planner', description: 'Generated your first roadmap', icon: '🗺️', condition: activityHistory.some(a => a.type === 'roadmap_generated') },
      { id: 'skill_seeker', name: 'Skill Seeker', description: 'Analyzed skill gaps', icon: '🎓', condition: activityHistory.some(a => a.type === 'skill_gap_analyzed') }
    ];

    badgeDefinitions.forEach(badge => {
      if (badge.condition && !badges.find(b => b.id === badge.id)) {
        newBadges.push({...badge, earnedAt: new Date().toISOString()});
      }
    });

    if (newBadges.length > 0) {
      setBadges(prev => {
        const updated = [...prev, ...newBadges];
        localStorage.setItem('userBadges', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    const fields = [
      profileData.name,
      profileData.email,
      profileData.phone,
      profileData.bio,
      profileData.targetRole,
      profileData.location,
      profileData.linkedin,
      profileData.github,
      imagePreview
    ];
    const filled = fields.filter(f => f && f.trim()).length;
    return Math.round((filled / fields.length) * 100);
  };

  // Generate recommendations based on user data
  const getRecommendations = () => {
    const recommendations = [];
    const avgScore = userStats.atsScoreCount > 0 ? userStats.totalATSScore / userStats.atsScoreCount : 0;

    if (userStats.resumesAnalyzed === 0) {
      recommendations.push({
        title: 'Upload Your First Resume',
        description: 'Get started by analyzing your resume for ATS compatibility',
        action: 'Analyze Resume',
        icon: '📄',
        link: '/dashboard'
      });
    } else if (avgScore < 70) {
      recommendations.push({
        title: 'Improve Your ATS Score',
        description: 'Your average score is below 70%. Review our optimization tips',
        action: 'View Tips',
        icon: '📈',
        link: '/dashboard'
      });
    }

    if (!activityHistory.some(a => a.type === 'roadmap_generated')) {
      recommendations.push({
        title: 'Generate Your Career Roadmap',
        description: 'Get a personalized plan to reach your career goals',
        action: 'Create Roadmap',
        icon: '🗺️',
        link: '/roadmap'
      });
    }

    if (!activityHistory.some(a => a.type === 'skill_gap_analyzed')) {
      recommendations.push({
        title: 'Analyze Your Skill Gaps',
        description: 'Identify missing skills for your target role',
        action: 'Analyze Skills',
        icon: '🎯',
        link: '/skill-gap'
      });
    }

    if (calculateProfileCompletion() < 80) {
      recommendations.push({
        title: 'Complete Your Profile',
        description: 'Add more information to make your profile stand out',
        action: 'Edit Profile',
        icon: '✨',
        link: '#'
      });
    }

    return recommendations.slice(0, 3); // Show top 3
  };

  const handleLogout = () => {
    // Clear user session/auth from localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userActivityStats');
    localStorage.removeItem('userActivityHistory');
    localStorage.removeItem('resumeHistory');
    localStorage.removeItem('skillProgress');
    localStorage.removeItem('userBadges');
    
    // Redirect to login/home
    window.location.href = '/';
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${apiBase}/api/auth/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: user?.username })
      });

      if (response.ok) {
        // Clear all user data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userActivityStats');
        localStorage.removeItem('userActivityHistory');
        localStorage.removeItem('resumeHistory');
        localStorage.removeItem('skillProgress');
        localStorage.removeItem('userBadges');
        
        alert('Your account has been permanently deleted.');
        window.location.href = '/';
      } else {
        alert('Failed to delete account. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account: ' + error.message);
    }
  };

  return (
    <div className={styles.profileContainer}>
      {/* Main Profile Card */}
      <div className={styles.mainCard}>
        {/* Cover Image */}
        <div className={styles.coverImageWrapper}>
          <div 
            className={styles.coverImage} 
            style={{ backgroundImage: `url(${bannerPreview})` }}
            onClick={handleBannerClick}
          >
            <div className={styles.bannerUploadOverlay}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              <span>{bannerImage ? 'Change Banner' : 'Upload Banner'}</span>
            </div>
          </div>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerUpload}
            className={styles.fileInput}
          />
        </div>
        
        {/* Profile Info Section */}
        <div className={styles.profileInfoSection}>
          <div className={styles.avatarWrapper}>
            <div className={styles.largeAvatar} onClick={handleAvatarClick}>
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className={styles.avatarImage} />
              ) : (
                <svg className={styles.personIcon} viewBox="0 0 24 24" fill="none">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.67 14 5 15.17 5 17.5V20H19V17.5C19 15.17 14.33 14 12 14Z" fill="currentColor"/>
                </svg>
              )}
              <div className={styles.uploadOverlay}>
                <span className={styles.uploadText}>{imagePreview ? 'Change' : 'Upload'}</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.fileInput}
            />
          </div>

          <div className={styles.profileDetails}>
            {editMode ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  className={styles.editInputName}
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  name="targetRole"
                  value={profileData.targetRole}
                  onChange={handleChange}
                  className={styles.editInputRole}
                  placeholder="Target Role"
                />
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleChange}
                  className={styles.editInputLocation}
                  placeholder="Location"
                />
              </>
            ) : (
              <>
                <h1 className={styles.profileName}>{profileData.name}</h1>
                <p className={styles.profileUsername}>@{profileData.username}</p>
                <p className={styles.profileRole}>{profileData.targetRole}</p>
                <p className={styles.profileLocation}>{profileData.location}</p>
              </>
            )}

            <div className={styles.actionButtonsTop}>
              {!editMode ? (
                <>
                  <button className={styles.secondaryButton} onClick={() => setEditMode(true)}>
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <button className={styles.saveButton} onClick={handleSave}>
                    Save Changes
                  </button>
                  <button className={styles.cancelButton} onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionHeader}>About</h2>
        {editMode ? (
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
            className={styles.editTextarea}
            placeholder="Tell us about yourself"
            rows={4}
          />
        ) : (
          <p className={styles.aboutText}>{profileData.bio}</p>
        )}
      </div>

      {/* Contact Information */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionHeader}>Contact Information</h2>
        <div className={styles.contactGrid}>
          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="#666">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
            </div>
            <div className={styles.contactDetails}>
              <span className={styles.contactLabel}>Email</span>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  className={styles.editInput}
                  placeholder="your.email@example.com"
                />
              ) : (
                <a href={`mailto:${profileData.email}`} className={styles.contactValue}>
                  {profileData.email}
                </a>
              )}
            </div>
          </div>

          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="#666">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
            </div>
            <div className={styles.contactDetails}>
              <span className={styles.contactLabel}>Phone</span>
              {editMode ? (
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  className={styles.editInput}
                  placeholder="+1 (234) 567-8900"
                />
              ) : (
                profileData.phone ? (
                  <a href={`tel:${profileData.phone}`} className={styles.contactValue}>
                    {profileData.phone}
                  </a>
                ) : (
                  <p className={styles.contactValue}>Not added</p>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionHeader}>Social Profiles</h2>
        <div className={styles.socialGrid}>
          <div className={styles.socialItem}>
            <div className={styles.socialIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="#0A66C2">
                <path d="M18.571 0H1.429C.64 0 0 .64 0 1.429v17.142C0 19.36.64 20 1.429 20h17.142c.789 0 1.429-.64 1.429-1.429V1.429C20 .64 19.36 0 18.571 0zM6 17H3V8h3v9zM4.5 6.5C3.5 6.5 3 5.8 3 5s.5-1.5 1.5-1.5S6 4.2 6 5s-.5 1.5-1.5 1.5zM17 17h-3v-4.5c0-1.1-.4-1.8-1.4-1.8-.8 0-1.2.5-1.4 1-.1.2-.1.4-.1.7V17h-3V8h3v1.3c.4-.6 1.1-1.5 2.6-1.5 1.9 0 3.3 1.2 3.3 3.9V17z"/>
              </svg>
            </div>
            <div>
              <p className={styles.socialLabel}>LinkedIn</p>
              {editMode ? (
                <>
                  <input
                    type="url"
                    name="linkedin"
                    value={profileData.linkedin}
                    onChange={handleChange}
                    className={`${styles.editInput} ${errors.linkedin ? styles.inputError : ''}`}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                  {errors.linkedin && <p className={styles.errorMessage}>{errors.linkedin}</p>}
                </>
              ) : (
                profileData.linkedin ? (
                  <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialValue}>
                    {profileData.linkedin}
                  </a>
                ) : (
                  <p className={styles.socialValue}>Not added</p>
                )
              )}
            </div>
          </div>

          <div className={styles.socialItem}>
            <div className={styles.socialIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="#181717">
                <path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"/>
              </svg>
            </div>
            <div>
              <p className={styles.socialLabel}>GitHub</p>
              {editMode ? (
                <>
                  <input
                    type="url"
                    name="github"
                    value={profileData.github}
                    onChange={handleChange}
                    className={`${styles.editInput} ${errors.github ? styles.inputError : ''}`}
                    placeholder="https://github.com/yourprofile"
                  />
                  {errors.github && <p className={styles.errorMessage}>{errors.github}</p>}
                </>
              ) : (
                profileData.github ? (
                  <a href={profileData.github} target="_blank" rel="noopener noreferrer" className={styles.socialValue}>
                    {profileData.github}
                  </a>
                ) : (
                  <p className={styles.socialValue}>Not added</p>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      <div className={styles.sectionCard}>
        <div className={styles.completionHeader}>
          <h2 className={styles.sectionHeader}>Profile Strength</h2>
          <span className={styles.completionPercent}>{calculateProfileCompletion()}%</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{width: `${calculateProfileCompletion()}%`}}
          ></div>
        </div>
        <p className={styles.completionText}>
          {calculateProfileCompletion() === 100 ? 
            '🎉 Your profile is complete!' : 
            `Complete your profile to increase visibility`
          }
        </p>
      </div>

      {/* Recommendations & Next Steps */}
      {getRecommendations().length > 0 && (
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionHeader}>Recommended For You</h2>
          <div className={styles.recommendationsGrid}>
            {getRecommendations().map((rec, index) => (
              <div key={index} className={styles.recommendationCard}>
                <div className={styles.recIcon}>{rec.icon}</div>
                <div className={styles.recContent}>
                  <h3 className={styles.recTitle}>{rec.title}</h3>
                  <p className={styles.recDescription}>{rec.description}</p>
                  <button className={styles.recButton}>{rec.action}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Badges */}
      {badges.length > 0 && (
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionHeader}>Achievements</h2>
          <div className={styles.badgesGrid}>
            {badges.map((badge, index) => (
              <div key={index} className={styles.badgeCard} title={badge.description}>
                <div className={styles.badgeIcon}>{badge.icon}</div>
                <div className={styles.badgeName}>{badge.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resume History & ATS Trend */}
      {resumeHistory.length > 0 && (
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionHeader}>Resume Analysis History</h2>
          <div className={styles.resumeHistoryList}>
            {resumeHistory.slice(0, 5).map((resume, index) => (
              <div key={resume.id} className={styles.resumeHistoryItem}>
                <div className={styles.resumeInfo}>
                  <div className={styles.resumeIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#0a66c2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                      <path d="M14 2v6h6M16 13H8m8 4H8m2-8H8"/>
                    </svg>
                  </div>
                  <div>
                    <div className={styles.resumeName}>{resume.name}</div>
                    <div className={styles.resumeDate}>{resume.timestamp}</div>
                  </div>
                </div>
                <div className={styles.resumeScore}>
                  <div className={`${styles.scoreCircle} ${resume.atsScore >= 80 ? styles.scoreHigh : resume.atsScore >= 60 ? styles.scoreMedium : styles.scoreLow}`}>
                    {resume.atsScore}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Progress */}
      {skillProgress.length > 0 && (
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionHeader}>Skill Development</h2>
          <div className={styles.skillsList}>
            {skillProgress.slice(0, 8).map((skill, index) => (
              <div key={index} className={styles.skillItem}>
                <div className={styles.skillHeader}>
                  <span className={styles.skillName}>{skill.name}</span>
                  <span className={styles.skillPercent}>{skill.progress}%</span>
                </div>
                <div className={styles.skillBar}>
                  <div 
                    className={styles.skillBarFill} 
                    style={{width: `${skill.progress}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionHeader}>Activity</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{userStats.resumesAnalyzed}</div>
            <div className={styles.statLabel}>Resumes Analyzed</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{userStats.analysesCompleted}</div>
            <div className={styles.statLabel}>Analyses Completed</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {userStats.atsScoreCount > 0 
                ? Math.round(userStats.totalATSScore / userStats.atsScoreCount) 
                : 0}%
            </div>
            <div className={styles.statLabel}>Avg ATS Score</div>
          </div>
        </div>
      </div>

      {/* Activity History */}
      {activityHistory.length > 0 && (
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionHeader}>Recent Activity</h2>
          <div className={styles.activityFeed}>
            {activityHistory.slice(0, 10).map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  {activity.type === 'resume_analyzed' && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="#0a66c2">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                    </svg>
                  )}
                  {activity.type === 'roadmap_generated' && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="#057642">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                  )}
                  {activity.type === 'skill_gap_analyzed' && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="#f59e0b">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                    </svg>
                  )}
                </div>
                <div className={styles.activityContent}>
                  <p className={styles.activityText}>{activity.description}</p>
                  <span className={styles.activityTime}>{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legal Section */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionHeader}>Legal</h2>
        <div className={styles.legalItem} onClick={() => setShowTermsModal(true)}>
          <span>Terms & Conditions</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 12l4-4-4-4"/>
          </svg>
        </div>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className={styles.modalOverlay} onClick={() => setShowTermsModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Terms & Conditions</h2>
              <button className={styles.closeButton} onClick={() => setShowTermsModal(false)}>
                ✕
              </button>
            </div>
            <div className={styles.modalContent}>
              <p className={styles.lastUpdated}><strong>Last Updated:</strong> 30th December 2025</p>

              <h3>Welcome to Resume Analyzer</h3>
              <p>By accessing or using our website and services, you agree to comply with and be bound by the following Terms and Conditions. If you do not agree, please do not use our platform.</p>

              <h3>About the Platform</h3>
              <p>Resume Analyzer is an online tool designed to help users improve their resumes using features such as:</p>
              <ul>
                <li>ATS Score Analysis</li>
                <li>HR Review Insights</li>
                <li>Career Roadmap Suggestions</li>
                <li>Skill Gap Identification</li>
              </ul>
              <p>The platform provides guidance and recommendations based on automated systems and predefined models.</p>

              <h3>Eligibility</h3>
              <p>You must be at least 18 years old to use this platform.</p>
              <p>By using this service, you confirm that the information you provide is accurate and belongs to you.</p>

              <h3>Use of Services</h3>
              <p>You agree to:</p>
              <ul>
                <li>Upload only your own resume or content you are authorized to use.</li>
                <li>Not misuse the platform for illegal, harmful, or unethical activities.</li>
                <li>Not attempt to reverse-engineer, hack, or disrupt the platform.</li>
              </ul>
              <p>You agree not to upload:</p>
              <ul>
                <li>False, misleading, or copyrighted content without permission.</li>
                <li>Malicious files or content intended to harm the platform.</li>
              </ul>

              <h3>Resume Analysis & Accuracy Disclaimer</h3>
              <ul>
                <li>ATS scores, HR reviews, career roadmaps, and skill gap results are informational only.</li>
                <li>Results are generated using automated logic, AI models, or predefined criteria.</li>
                <li>We do not guarantee job placement, interview calls, or hiring success.</li>
                <li>Final hiring decisions are always made by employers, not our platform.</li>
              </ul>

              <h3>HR Review Feature</h3>
              <ul>
                <li>HR review insights are simulated or generalized professional suggestions.</li>
                <li>These insights do not represent opinions of real hiring managers unless explicitly stated.</li>
                <li>Use these suggestions as guidance, not as final authority.</li>
              </ul>

              <h3>Career Roadmap & Skill Gap Finder</h3>
              <ul>
                <li>Career roadmaps and skill gap analysis are based on trends, role requirements, and uploaded resume data.</li>
                <li>Recommendations may not be suitable for every individual or job market.</li>
                <li>Users are encouraged to do their own research before making career decisions.</li>
              </ul>

              <h3>Data Privacy & Security</h3>
              <ul>
                <li>Your resume data is used only for analysis purposes.</li>
                <li>We do not sell your personal data.</li>
                <li>While we follow reasonable security practices, 100% data security cannot be guaranteed.</li>
                <li>Please refer to our Privacy Policy for more details.</li>
              </ul>

              <h3>Intellectual Property</h3>
              <ul>
                <li>All content, design, logic, and features of Resume Analyzer are protected by intellectual property laws.</li>
                <li>You may not copy, reproduce, or distribute any part of the platform without permission.</li>
              </ul>

              <h3>Limitation of Liability</h3>
              <p>Resume Analyzer shall not be liable for:</p>
              <ul>
                <li>Any loss of job opportunities</li>
                <li>Career decisions made based on platform output</li>
                <li>Data loss, delays, or service interruptions</li>
              </ul>
              <p>Use the platform at your own risk.</p>

              <h3>Changes to Terms</h3>
              <p>We reserve the right to update or modify these Terms & Conditions at any time. Changes will be effective immediately after being posted on this page.</p>

              <h3>Termination of Access</h3>
              <p>We may suspend or terminate your access if:</p>
              <ul>
                <li>You violate these Terms</li>
                <li>You misuse the platform</li>
                <li>Your actions harm other users or the platform</li>
              </ul>

              <h3>Contact Us</h3>
              <p>If you have any questions regarding these Terms & Conditions, please contact us at:</p>
              <ul>
                <li>📧 Email: onlydevgdg@gmail.com</li>
                <li>🌐 Website: your-website-url</li>
              </ul>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.acceptButton} onClick={() => setShowTermsModal(false)}>
                I Agree & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Management Section */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionHeader}>Account Settings</h2>
        <div className={styles.accountManagementContainer}>
          <div className={styles.accountOption}>
            <div className={styles.accountOptionInfo}>
              <h3 className={styles.accountOptionTitle}>Logout</h3>
              <p className={styles.accountOptionDescription}>Sign out from this device</p>
            </div>
            <button className={styles.logoutButton} onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              Logout
            </button>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.accountOption}>
            <div className={styles.accountOptionInfo}>
              <h3 className={styles.accountOptionTitle}>Delete Account</h3>
              <p className={styles.accountOptionDescription}>Permanently delete your account and all data</p>
            </div>
            <button className={styles.deleteButton} onClick={() => setShowDeleteModal(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h16zM10 11v6M14 11v6"/>
              </svg>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.deleteModalHeader}>
              <h2>Delete Account?</h2>
              <button className={styles.closeButton} onClick={() => setShowDeleteModal(false)}>
                ✕
              </button>
            </div>
            <div className={styles.modalContent}>
              <p className={styles.deleteWarning}>
                <strong>⚠️ Warning:</strong> This action is permanent and cannot be undone.
              </p>
              <p>When you delete your account:</p>
              <ul>
                <li>Your account and all associated data will be permanently removed</li>
                <li>All your resumes, analyses, and activity history will be deleted</li>
                <li>You will not be able to recover this information</li>
                <li>You can create a new account with the same email later</li>
              </ul>
              <p><strong>Are you sure you want to continue?</strong></p>
            </div>
            <div className={styles.deleteModalFooter}>
              <button className={styles.cancelDeleteButton} onClick={() => setShowDeleteModal(false)}>
                Keep Account
              </button>
              <button className={styles.confirmDeleteButton} onClick={() => {
                setShowDeleteModal(false);
                handleDeleteAccount();
              }}>
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
