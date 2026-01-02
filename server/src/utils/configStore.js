import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Resolve to project root's config.yaml when running from server directory
const CONFIG_PATH = path.resolve(process.cwd(), '..', 'config.yaml');

function loadConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const data = yaml.load(raw) || {};
    return data;
  } catch (err) {
    // If missing, create a default minimal structure
    const data = {
      credentials: { usernames: {} },
      cookie: {
        expiry_days: 30,
        key: 'resume_analyzer_auth',
        name: 'resume_analyzer_auth'
      },
      preauthorized: { emails: [] }
    };
    fs.writeFileSync(CONFIG_PATH, yaml.dump(data));
    return data;
  }
}

function saveConfig(cfg) {
  const yamlText = yaml.dump(cfg, { noRefs: true });
  fs.writeFileSync(CONFIG_PATH, yamlText);
}

export const ConfigStore = {
  getAll() {
    return loadConfig();
  },
  getUser(username) {
    const cfg = loadConfig();
    const users = cfg?.credentials?.usernames || {};
    return users[username] || null;
  },
  findUserByEmail(email) {
    if (!email) return null;
    const cfg = loadConfig();
    const users = cfg?.credentials?.usernames || {};
    const target = (email || '').trim().toLowerCase();
    return Object.entries(users).reduce((found, [uname, info]) => {
      if (found) return found;
      if ((info.email || '').trim().toLowerCase() === target) {
        return { username: uname, ...info };
      }
      return null;
    }, null);
  },
  addUser({ username, name, email, hashedPassword, provider = 'local', subject = null, avatar = null }) {
    const cfg = loadConfig();
    cfg.credentials = cfg.credentials || { usernames: {} };
    cfg.credentials.usernames = cfg.credentials.usernames || {};

    cfg.credentials.usernames[username] = {
      name,
      email,
      password: hashedPassword || null,
      provider,
      subject,
      avatar,
      profile: {
        phone: '',
        bio: '',
        targetRole: '',
        experience: '',
        location: '',
        linkedin: '',
        github: ''
      }
    };

    cfg.preauthorized = cfg.preauthorized || { emails: [] };
    if (!cfg.preauthorized.emails.includes(email)) {
      cfg.preauthorized.emails.push(email);
    }

    saveConfig(cfg);
    return true;
  },
  upsertOAuthUser({ username, name, email, provider = 'google', subject = null, avatar = null }) {
    const cfg = loadConfig();
    cfg.credentials = cfg.credentials || { usernames: {} };
    cfg.credentials.usernames = cfg.credentials.usernames || {};

    cfg.credentials.usernames[username] = {
      ...(cfg.credentials.usernames[username] || {}),
      name,
      email,
      password: null,
      provider,
      subject,
      avatar,
      profile: {
        phone: '',
        bio: '',
        targetRole: '',
        experience: '',
        location: '',
        linkedin: '',
        github: '',
        ...(cfg.credentials.usernames[username]?.profile || {})
      }
    };

    cfg.preauthorized = cfg.preauthorized || { emails: [] };
    if (!cfg.preauthorized.emails.includes(email)) {
      cfg.preauthorized.emails.push(email);
    }

    saveConfig(cfg);
    return true;
  },
  getProfile(username) {
    const user = this.getUser(username);
    return user?.profile || {
      phone: '',
      bio: '',
      targetRole: '',
      experience: '',
      location: '',
      linkedin: '',
      github: ''
    };
  },
  updateProfile(username, profileData) {
    const cfg = loadConfig();
    const users = cfg?.credentials?.usernames || {};
    
    if (users[username]) {
      users[username].profile = {
        ...users[username].profile,
        ...profileData
      };
      saveConfig(cfg);
      return true;
    }
    return false;
  },
  deleteUser(username) {
    const cfg = loadConfig();
    const users = cfg?.credentials?.usernames || {};
    
    if (users[username]) {
      // Remove user from usernames
      delete users[username];
      
      // Remove from preauthorized emails
      const email = cfg?.preauthorized?.emails || [];
      const userEmail = cfg.credentials.usernames[username]?.email;
      if (userEmail) {
        cfg.preauthorized.emails = email.filter(e => e !== userEmail);
      }
      
      saveConfig(cfg);
      return true;
    }
    return false;
  }
};
