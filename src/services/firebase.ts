import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration comes from environment variables (set on Vercel).
// In local dev without a .env file we fall back to a placeholder so the app
// still boots and renders the built-in default content instead of crashing.
const env = import.meta.env;
const hasKey = Boolean(env.VITE_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? (env.DEV ? 'local-dev-placeholder' : undefined),
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID ?? (env.DEV ? 'local-dev' : undefined),
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

if (!hasKey && env.DEV) {
  console.info('[firebase] No VITE_FIREBASE_* env found – running with built-in default data.');
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
