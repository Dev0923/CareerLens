import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

// Check if running in production with environment variable
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log('✅ Firebase credentials loaded from environment variable');
    console.log('   Project ID:', serviceAccount.project_id);
    console.log('   Client Email:', serviceAccount.client_email);
  } catch (error) {
    console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:', error.message);
    console.error('   Raw value length:', process.env.FIREBASE_SERVICE_ACCOUNT?.length);
    throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT environment variable');
  }
} else {
  console.log('⚠️  FIREBASE_SERVICE_ACCOUNT not set, using local file');
  // Local development: read from file
  const serviceAccountPath = path.resolve(__dirname, '../../firebase-service-account.json');
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error('firebase-service-account.json not found. Please add it or set FIREBASE_SERVICE_ACCOUNT env var.');
  }
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  console.log('✅ Firebase credentials loaded from file');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'careerlens-7bc8c'
});

export const db = admin.firestore();
export const auth = admin.auth();

export default admin;
