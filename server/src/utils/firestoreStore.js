import { db } from './firebase.js';
import bcrypt from 'bcryptjs';

const USERS_COLLECTION = 'users';

export const FirestoreUserStore = {
  // Get all users
  async getAll() {
    const snapshot = await db.collection(USERS_COLLECTION).get();
    const users = {};
    snapshot.forEach(doc => {
      users[doc.id] = doc.data();
    });
    return { credentials: { usernames: users } };
  },

  // Get user by username
  async getUser(username) {
    const doc = await db.collection(USERS_COLLECTION).doc(username).get();
    return doc.exists ? doc.data() : null;
  },

  // Find user by email
  async findUserByEmail(email) {
    const snapshot = await db
      .collection(USERS_COLLECTION)
      .where('email', '==', email)
      .limit(1)
      .get();
    return snapshot.empty ? null : snapshot.docs[0].data();
  },

  // Add new user
  async addUser({ username, name, email, hashedPassword, provider = 'local', subject = null, avatar = null }) {
    const userData = {
      username: username.trim().toLowerCase(),
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      provider,
      subject,
      avatar,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.collection(USERS_COLLECTION).doc(username.trim().toLowerCase()).set(userData);
    return userData;
  },

  // Upsert OAuth user
  async upsertOAuthUser({ username, name, email, provider = 'google', subject = null, avatar = null }) {
    const userRef = db.collection(USERS_COLLECTION).doc(username.trim().toLowerCase());
    const userData = {
      username: username.trim().toLowerCase(),
      name: name.trim(),
      email: email.trim(),
      provider,
      subject,
      avatar,
      updatedAt: new Date()
    };
    
    const doc = await userRef.get();
    if (!doc.exists) {
      userData.createdAt = new Date();
    }
    
    await userRef.set(userData, { merge: true });
    return userData;
  },

  // Get user profile
  async getProfile(username) {
    const doc = await db.collection(USERS_COLLECTION).doc(username.trim().toLowerCase()).get();
    if (!doc.exists) return null;
    
    const data = doc.data();
    return {
      username: data.username,
      name: data.name,
      email: data.email,
      avatar: data.avatar || null,
      profileImage: data.profileImage || null,
      bannerImage: data.bannerImage || null,
      provider: data.provider || 'local',
      phone: data.phone || '',
      bio: data.bio || '',
      targetRole: data.targetRole || '',
      experience: data.experience || '',
      location: data.location || '',
      linkedin: data.linkedin || '',
      github: data.github || ''
    };
  },

  // Update user profile
  async updateProfile(username, profileData) {
    const userRef = db.collection(USERS_COLLECTION).doc(username.trim().toLowerCase());
    const doc = await userRef.get();
    
    if (!doc.exists) return false;
    
    await userRef.update({
      ...profileData,
      updatedAt: new Date()
    });
    return true;
  },

  // Delete user
  async deleteUser(username) {
    const userRef = db.collection(USERS_COLLECTION).doc(username.trim().toLowerCase());
    const doc = await userRef.get();
    
    if (!doc.exists) return false;
    
    await userRef.delete();
    return true;
  }
};
