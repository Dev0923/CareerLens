// Activity Tracker Utility
// This utility helps track user activities across the application

/**
 * Track resume analysis activity
 * @param {number} atsScore - The ATS score received (0-100)
 */
export function trackResumeAnalysis(atsScore) {
  if (window.updateUserActivity) {
    window.updateUserActivity(
      'resume_analyzed',
      `Resume analyzed with ATS score of ${atsScore}%`,
      atsScore
    );
  }
}

/**
 * Track career roadmap generation
 * @param {string} role - The role for which roadmap was generated
 */
export function trackRoadmapGeneration(role) {
  if (window.updateUserActivity) {
    window.updateUserActivity(
      'roadmap_generated',
      `Generated career roadmap for ${role}`
    );
  }
}

/**
 * Track skill gap analysis
 * @param {string} role - The role analyzed
 */
export function trackSkillGapAnalysis(role) {
  if (window.updateUserActivity) {
    window.updateUserActivity(
      'skill_gap_analyzed',
      `Analyzed skill gaps for ${role}`
    );
  }
}
