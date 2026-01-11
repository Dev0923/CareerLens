import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './AnimatedLogin.module.css';
import API from '../apiBase.js';

// Use the provided resume hero photo in public/Login-page resuem.jpg
const heroImage = '/Login-page%20resuem.jpg';

export default function AnimatedLogin({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', username: '', email: '', password: '', password2: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const googleButtonRef = useRef(null);
  const googleRenderedRef = useRef(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  const cardVariants = {
    initial: { opacity: 0, y: 32, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: 16 },
  };

  const handleError = (msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  useEffect(() => {
    if (!googleClientId) return;
    if (window.google?.accounts?.id) {
      setGoogleReady(true);
      return;
    }
    if (document.getElementById('google-identity')) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.id = 'google-identity';
    script.onload = () => setGoogleReady(true);
    document.head.appendChild(script);
  }, [googleClientId]);

  useEffect(() => {
    if (!googleReady || !googleClientId || !googleButtonRef.current || googleRenderedRef.current) return;
    if (!window.google?.accounts?.id) return;
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredential,
      ux_mode: 'popup'
    });
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      logo_alignment: 'left'
    });
    googleRenderedRef.current = true;
  }, [googleReady, googleClientId]);

  const handleGoogleCredential = async (response) => {
    try {
      if (!response?.credential) return handleError('Google sign-in failed.');
      const res = await fetch(`${API}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });
      const data = await res.json();
      if (!data.ok) return handleError(data.message || 'Google sign-in failed');
      onAuth && onAuth(data.user);
    } catch (err) {
      handleError(err.message || 'Google sign-in failed');
    }
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setError(null);
    if (!loginForm.username || !loginForm.password) return handleError('Please enter both fields');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!data.ok) return handleError(data.message || 'Login failed');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1000);
      onAuth && onAuth(data.user);
    } catch (err) {
      handleError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const submitSignup = async (e) => {
    e.preventDefault();
    setError(null);
    if (signupForm.password !== signupForm.password2) return handleError('Passwords do not match');
    if (!signupForm.name || !signupForm.username || !signupForm.email) return handleError('Please fill all required fields');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signupForm.name, username: signupForm.username, email: signupForm.email, password: signupForm.password }),
      });
      const data = await res.json();
      if (!data.ok) return handleError(data.message || 'Signup failed');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1000);
      setMode('login');
      setLoginForm({ username: signupForm.username, password: '' });
    } catch (err) {
      handleError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.bg} aria-hidden />

      <motion.div className={`${styles.shell} ${shake ? styles.shake : ''}`} variants={cardVariants} initial="initial" animate="animate" exit="exit">
        <div className={styles.visual}>
          <div className={styles.visualImage} style={{ backgroundImage: `url(${heroImage})` }} />
          <div className={styles.visualContent}>
            <div></div>
            <div className={styles.visualText}>
              <p className={styles.kicker}>Create Account</p>
              <h2>Resume Intelligence, Simplified</h2>
              <p className={styles.caption}>Upload your resume, compare with job descriptions, and get instant, tailored feedback.</p>
              <button type="button" className={styles.ghostButton} onClick={() => setMode('signup')}>Sign up</button>
            </div>
          </div>
        </div>

        <div className={styles.formPanel}>
          <div className={styles.formHeader}>
            <div>
              <p className={styles.subtle}>{mode === 'login' ? 'Welcome back' : 'Let’s get started'}</p>
              <h3>{mode === 'login' ? 'Log In' : 'Create Account'}</h3>
            </div>
            <div className={styles.tabRow}>
              <button type="button" className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`} onClick={() => setMode('login')}>Log In</button>
              <button type="button" className={`${styles.tab} ${mode === 'signup' ? styles.tabActive : ''}`} onClick={() => setMode('signup')}>Sign Up</button>
            </div>
          </div>

          {mode === 'login' ? (
            <form className={styles.form} onSubmit={submitLogin}>
              <label className={styles.label} htmlFor="login-username">Username or Email</label>
              <input id="login-username" className={styles.input} type="text" value={loginForm.username} onChange={(e)=>setLoginForm(f=>({...f, username:e.target.value}))} autoComplete="username" placeholder="you@example.com" />

              <label className={styles.label} htmlFor="login-password">Password</label>
              <input id="login-password" className={styles.input} type="password" value={loginForm.password} onChange={(e)=>setLoginForm(f=>({...f, password:e.target.value}))} autoComplete="current-password" placeholder="••••••••" />

              <div className={styles.inlineRow}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
              </div>

              <button className={styles.primary} type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Log In'}</button>

              <p className={styles.switcher}>Don’t have an account? <button type="button" className={styles.textBtn} onClick={() => setMode('signup')}>Sign up</button></p>
            </form>
          ) : (
            <form className={styles.form} onSubmit={submitSignup}>
              <label className={styles.label} htmlFor="signup-name">Full Name</label>
              <input id="signup-name" className={styles.input} type="text" value={signupForm.name} onChange={(e)=>setSignupForm(f=>({...f, name:e.target.value}))} autoComplete="name" placeholder="Alex Morgan" />

              <label className={styles.label} htmlFor="signup-username">Username</label>
              <input id="signup-username" className={styles.input} type="text" value={signupForm.username} onChange={(e)=>setSignupForm(f=>({...f, username:e.target.value}))} autoComplete="username" placeholder="alexm" />

              <label className={styles.label} htmlFor="signup-email">Email</label>
              <input id="signup-email" className={styles.input} type="email" value={signupForm.email} onChange={(e)=>setSignupForm(f=>({...f, email:e.target.value}))} autoComplete="email" placeholder="you@example.com" />

              <label className={styles.label} htmlFor="signup-password">Password</label>
              <input id="signup-password" className={styles.input} type="password" value={signupForm.password} onChange={(e)=>setSignupForm(f=>({...f, password:e.target.value}))} autoComplete="new-password" placeholder="Create a password" />

              <label className={styles.label} htmlFor="signup-password2">Confirm Password</label>
              <input id="signup-password2" className={styles.input} type="password" value={signupForm.password2} onChange={(e)=>setSignupForm(f=>({...f, password2:e.target.value}))} autoComplete="new-password" placeholder="Re-enter password" />

              <button className={styles.primary} type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Create Account'}</button>

              <p className={styles.switcher}>Already have an account? <button type="button" className={styles.textBtn} onClick={() => setMode('login')}>Log in</button></p>
            </form>
          )}

          <div className={styles.googleRow}>
            <div ref={googleButtonRef} aria-label="Sign in with Google" />
            {!googleClientId && <p className={styles.googleHint}>Add VITE_GOOGLE_CLIENT_ID to enable Google sign-in.</p>}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div key="err" className={styles.error} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} aria-live="polite">
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {success && (
            <motion.div key="success" className={styles.successOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className={styles.successBox} role="status" aria-live="polite">
                <svg className={styles.check} viewBox="0 0 24 24" aria-hidden>
                  <path d="M4 12.5l5 5 11-11" />
                </svg>
                <div>Success</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
