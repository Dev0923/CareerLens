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
    if (!url) return true; // Empty is allowed
    const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[\w\-]+\/?$/;
    return linkedInRegex.test(url);
  };

  const isValidGitHubURL = (url) => {
    if (!url) return true; // Empty is allowed
    const gitHubRegex = /^https?:\/\/(www\.)?github\.com\/[\w\-]+\/?$/;
    return gitHubRegex.test(url);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      // Validate file size (max 5MB)
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
    // Validate social links
    const newErrors = {};
    
    if (profileData.linkedin && !isValidLinkedInURL(profileData.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)';
    }
    
    if (profileData.github && !isValidGitHubURL(profileData.github)) {
      newErrors.github = 'Please enter a valid GitHub profile URL (e.g., https://github.com/yourprofile)';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setEditMode(false);
    setErrors({});
    // Here you would typically save to backend
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar} onClick={handleAvatarClick}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className={styles.avatarImage} />
                ) : (
                  <svg className={styles.personIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <div className={styles.profileBasics}>
              {editMode ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className={styles.editInput}
                    placeholder="Full Name"
                  />
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleChange}
                    className={styles.editInputSmall}
                    placeholder="Username"
                  />
                </>
              ) : (
                <>
                  <h1 className={styles.profileName}>{profileData.name}</h1>
                  <p className={styles.profileUsername}>@{profileData.username}</p>
                </>
              )}
            </div>
          </div>
          <div className={styles.actionButtons}>
            {!editMode ? (
              <button className={styles.editButton} onClick={() => setEditMode(true)}>
                ✏️ Edit Profile
              </button>
            ) : (
              <>
                <button className={styles.saveButton} onClick={handleSave}>
                  💾 Save Changes
                </button>
                <button className={styles.cancelButton} onClick={() => setEditMode(false)}>
                  ✕ Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.profileSection}>
          <h3 className={styles.sectionTitle}>📧 Contact Information</h3>
          <div className={styles.infoGroup}>
            <label>Email</label>
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
              <p className={styles.infoValue}>{profileData.email}</p>
            )}
          </div>
        </div>

        <div className={styles.profileSection}>
          <h3 className={styles.sectionTitle}>👤 About You</h3>
          <div className={styles.infoGroup}>
            <label>Bio</label>
            {editMode ? (
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
                className={styles.editTextarea}
                placeholder="Tell us about yourself"
                rows={3}
              />
            ) : (
              <p className={styles.infoValue}>{profileData.bio}</p>
            )}
          </div>

          <div className={styles.twoColumns}>
            <div className={styles.infoGroup}>
              <label>Target Role</label>
              {editMode ? (
                <input
                  type="text"
                  name="targetRole"
                  value={profileData.targetRole}
                  onChange={handleChange}
                  className={styles.editInput}
                  placeholder="Target Role"
                />
              ) : (
                <p className={styles.infoValue}>{profileData.targetRole}</p>
              )}
            </div>

            <div className={styles.infoGroup}>
              <label>Experience</label>
              {editMode ? (
                <input
                  type="text"
                  name="experience"
                  value={profileData.experience}
                  onChange={handleChange}
                  className={styles.editInput}
                  placeholder="Years of experience"
                />
              ) : (
                <p className={styles.infoValue}>{profileData.experience}</p>
              )}
            </div>

            <div className={styles.infoGroup}>
              <label>Location</label>
              {editMode ? (
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleChange}
                  className={styles.editInput}
                  placeholder="Location"
                />
              ) : (
                <p className={styles.infoValue}>{profileData.location}</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.profileSection}>
          <h3 className={styles.sectionTitle}>🔗 Social Links</h3>
          <div className={styles.twoColumns}>
            <div className={styles.infoGroup}>
              <label>LinkedIn Profile</label>
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
                  {errors.linkedin && (
                    <p className={styles.errorMessage}>{errors.linkedin}</p>
                  )}
                </>
              ) : (
                profileData.linkedin ? (
                  <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    {profileData.linkedin}
                  </a>
                ) : (
                  <p className={styles.infoValue}>Not added</p>
                )
              )}
            </div>

            <div className={styles.infoGroup}>
              <label>GitHub Profile</label>
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
                  {errors.github && (
                    <p className={styles.errorMessage}>{errors.github}</p>
                  )}
                </>
              ) : (
                profileData.github ? (
                  <a href={profileData.github} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    {profileData.github}
                  </a>
                ) : (
                  <p className={styles.infoValue}>Not added</p>
                )
              )}
            </div>
          </div>
        </div>

        <div className={styles.profileSection}>
          <h3 className={styles.sectionTitle}>📊 Profile Stats</h3>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>0</div>
              <p className={styles.statLabel}>Resumes Analyzed</p>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>0</div>
              <p className={styles.statLabel}>Analyses Completed</p>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>0%</div>
              <p className={styles.statLabel}>Avg ATS Score</p>
            </div>
          </div>
        </div>

        <div className={styles.profileSection}>
          <h3 className={styles.sectionTitle}>🔒 Privacy & Security</h3>
          <div className={styles.settingItem}>
            <div>
              <p className={styles.settingName}>Account Visibility</p>
              <p className={styles.settingDesc}>Your profile is private</p>
            </div>
            <span className={styles.badge}>Private</span>
          </div>
          <div className={styles.settingItem}>
            <div>
              <p className={styles.settingName}>Data Retention</p>
              <p className={styles.settingDesc}>Data retained for 90 days</p>
            </div>
            <span className={styles.badge}>Secure</span>
          </div>
        </div>

        <div className={styles.profileSection}>
          <h3 className={styles.sectionTitle}>📋 Legal</h3>
          <div className={styles.settingItem}>
            <div>
              <p className={styles.settingName}>Terms & Conditions</p>
              <p className={styles.settingDesc}>Review our terms of service and legal policies</p>
            </div>
            <button 
              className={styles.viewButton}
              onClick={() => setShowTermsModal(true)}
            >
              View
            </button>
          </div>
        </div>
      </div>

      {showTermsModal && (
        <div className={styles.modalOverlay} onClick={() => setShowTermsModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Terms & Conditions</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowTermsModal(false)}
              >
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
              <button 
                className={styles.acceptButton}
                onClick={() => setShowTermsModal(false)}
              >
                I Agree & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
