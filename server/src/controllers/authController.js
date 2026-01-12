import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { FirestoreUserStore } from '../utils/firestoreStore.js';

const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const oauthClient = googleClientId ? new OAuth2Client(googleClientId) : null;

// Log OAuth initialization status
if (googleClientId) {
  console.log('✅ Google OAuth Client initialized with CLIENT_ID:', googleClientId.substring(0, 20) + '...');
} else {
  console.error('❌ GOOGLE_CLIENT_ID environment variable not set - Google login will fail');
}

function makeUsernameFromEmail(email, fallback = 'googleuser') {
  const base = (email || '').split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') || fallback;
  return base || fallback;
}

async function ensureUniqueUsername(base) {
  let candidate = base;
  let counter = 1;
  while (await FirestoreUserStore.getUser(candidate)) {
    candidate = `${base}${counter}`;
    counter += 1;
  }
  return candidate;
}

async function validateSignup({ username, name, email, password }) {
  const u = (username || '').trim().toLowerCase();
  const n = (name || '').trim();
  const e = (email || '').trim();
  const p = (password || '').trim();

  if (!u || !n || !e || !p) return 'All fields are required.';
  if (u.length < 3) return 'Username must be at least 3 characters.';
  if (p.length < 8) return 'Password must be at least 8 characters.';
  
  const existing = await FirestoreUserStore.getUser(u);
  if (existing) return 'Username already exists. Please choose another.';
  
  return null;
}

export const AuthController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body || {};
      const user = await FirestoreUserStore.getUser((username || '').trim().toLowerCase());
      if (!user) return res.status(404).json({ ok: false, message: 'User not found. Please sign up.' });

      const storedHash = user.password || '';
      const ok = bcrypt.compareSync((password || ''), storedHash);
      if (!ok) return res.status(401).json({ ok: false, message: 'Incorrect password.' });

      return res.json({ ok: true, user: { username, name: user.name, email: user.email } });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ ok: false, message: 'Login failed. Please try again.' });
    }
  },

  signup: async (req, res) => {
    try {
      const { username, name, email, password } = req.body || {};
      const err = await validateSignup({ username, name, email, password });
      if (err) return res.status(400).json({ ok: false, message: err });

      const hashedPassword = bcrypt.hashSync(password, 12);
      await FirestoreUserStore.addUser({ 
        username: username.trim().toLowerCase(), 
        name: name.trim(), 
        email: email.trim(), 
        hashedPassword 
      });
      
      return res.json({ ok: true, message: 'Account created successfully. You can now log in.' });
    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({ ok: false, message: 'Signup failed. Please try again.' });
    }
  },

  getProfile: async (req, res) => {
    try {
      const { username } = req.body || {};
      if (!username) {
        return res.status(400).json({ ok: false, message: 'Username is required.' });
      }

      const profile = await FirestoreUserStore.getProfile(username.trim().toLowerCase());
      return res.json({ ok: true, profile });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({ ok: false, message: 'Failed to get profile.' });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { username, profileData } = req.body || {};
      if (!username) {
        return res.status(400).json({ ok: false, message: 'Username is required.' });
      }

      let parsedProfileData = {};
      if (profileData) {
        try {
          parsedProfileData = typeof profileData === 'string' ? JSON.parse(profileData) : profileData;
        } catch (e) {
          parsedProfileData = profileData;
        }
      }

      // Handle file uploads
      if (req.files) {
        if (req.files.profileImage && req.files.profileImage.length > 0) {
          parsedProfileData.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
        }
        if (req.files.bannerImage && req.files.bannerImage.length > 0) {
          parsedProfileData.bannerImage = `/uploads/${req.files.bannerImage[0].filename}`;
        }
      }

      const success = await FirestoreUserStore.updateProfile(username.trim().toLowerCase(), parsedProfileData);
      if (success) {
        return res.json({ ok: true, message: 'Profile updated successfully.' });
      } else {
        return res.status(404).json({ ok: false, message: 'User not found.' });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({ ok: false, message: 'Failed to update profile.' });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const { username } = req.body || {};
      if (!username) {
        return res.status(400).json({ ok: false, message: 'Username is required.' });
      }

      const success = await FirestoreUserStore.deleteUser(username.trim().toLowerCase());
      if (success) {
        return res.json({ ok: true, message: 'Account deleted successfully.' });
      } else {
        return res.status(404).json({ ok: false, message: 'User not found.' });
      }
    } catch (error) {
      console.error('Delete account error:', error);
      return res.status(500).json({ ok: false, message: 'Failed to delete account.' });
    }
  },

  googleLogin: async (req, res) => {
    try {
      const { credential } = req.body || {};
      if (!credential) return res.status(400).json({ ok: false, message: 'Missing Google credential.' });
      if (!oauthClient) return res.status(500).json({ ok: false, message: 'Google client not configured on server.' });

      const ticket = await oauthClient.verifyIdToken({ idToken: credential, audience: googleClientId });
      const payload = ticket.getPayload();
      const email = payload?.email;
      const name = payload?.name || 'Google User';
      const subject = payload?.sub;
      const avatar = payload?.picture || null;

      if (!email || !subject) {
        return res.status(400).json({ ok: false, message: 'Invalid Google token.' });
      }

      const existingByEmail = await FirestoreUserStore.findUserByEmail(email);
      let username = existingByEmail?.username;

      if (!username) {
        const base = makeUsernameFromEmail(email, `google_${subject.slice(-6)}`);
        username = await ensureUniqueUsername(base);
      }

      await FirestoreUserStore.upsertOAuthUser({ username, name, email, provider: 'google', subject, avatar });

      return res.json({ ok: true, user: { username, name, email, avatar, provider: 'google' } });
    } catch (err) {
      console.error('Google login error:', err);
      return res.status(401).json({ ok: false, message: err.message || 'Google sign-in failed.' });
    }
  }
};
