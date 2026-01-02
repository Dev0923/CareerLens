import React, { useState } from 'react';
import styles from './Profile.module.css';

export default function Profile({ user, onBack }) {
  const [editMode, setEditMode] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = React.useRef(null);
  const [errors, setErrors] = useState({});
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: 'Aspiring professional seeking growth opportunities',
    targetRole: 'Software Engineer',
    experience: '2 years',
    location: 'India',
    linkedin: '',
    github: ''
  });

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

  const handleSave = () => {
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
    
    setEditMode(false);
    setErrors({});
  };

  return (
    <div className={styles.profileContainer}>
      {/* Main Profile Card */}
      <div className={styles.mainCard}>
        {/* Cover Image */}
        <div className={styles.coverImage}></div>
        
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
                <p className={styles.profileRole}>{profileData.targetRole}</p>
                <p className={styles.profileLocation}>{profileData.location} • <span className={styles.contactInfo}>Contact info</span></p>
              </>
            )}

            <div className={styles.actionButtonsTop}>
              {!editMode ? (
                <>
                  <button className={styles.secondaryButton} onClick={() => setEditMode(true)}>
                    Edit Profile
                  </button>
                  <button className={styles.moreButton}>•••</button>
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

      {/* Experience Section */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionHeader}>Experience</h2>
        <div className={styles.experienceItem}>
          <div className={styles.experienceLogo}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="4" fill="#667eea"/>
              <path d="M24 12L18 22H30L24 36L30 26H18L24 12Z" fill="white"/>
            </svg>
          </div>
          <div className={styles.experienceContent}>
            {editMode ? (
              <>
                <input
                  type="text"
                  name="targetRole"
                  value={profileData.targetRole}
                  onChange={handleChange}
                  className={styles.editInput}
                  placeholder="Role"
                />
                <input
                  type="text"
                  name="experience"
                  value={profileData.experience}
                  onChange={handleChange}
                  className={styles.editInputSmall}
                  placeholder="Experience"
                />
              </>
            ) : (
              <>
                <h3 className={styles.experienceTitle}>{profileData.targetRole}</h3>
                <p className={styles.experienceCompany}>Resume Analyzer</p>
                <p className={styles.experienceTime}>{profileData.experience}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionHeader}>Contact Information</h2>
        <div className={styles.contactGrid}>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Email</span>
            {editMode ? (
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className={styles.editInput}
                placeholder="Email"
              />
            ) : (
              <p className={styles.contactValue}>{profileData.email}</p>
            )}
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

      {/* Stats */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionHeader}>Activity</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>0</div>
            <div className={styles.statLabel}>Resumes Analyzed</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>0</div>
            <div className={styles.statLabel}>Analyses Completed</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>0%</div>
            <div className={styles.statLabel}>Avg ATS Score</div>
          </div>
        </div>
      </div>

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
              <p>By accessing or using our website and services, you agree to comply with and be bound by the following Terms and Conditions.</p>
              {/* Add rest of terms content here */}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.acceptButton} onClick={() => setShowTermsModal(false)}>
                I Agree & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
