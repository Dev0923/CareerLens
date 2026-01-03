import React, { useEffect, useRef, useState } from 'react';
import API from '../apiBase.js';

export default function LoginSignup({ onAuth }) {
  const [tab, setTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', username: '', email: '', password: '', password2: '', agree: false });
  const [message, setMessage] = useState(null);
  const [googleReady, setGoogleReady] = useState(false);
  const googleButtonRef = useRef(null);
  const googleRenderedRef = useRef(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

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
    script.crossOrigin = 'anonymous';
    script.onload = () => setGoogleReady(true);
    document.head.appendChild(script);
  }, [googleClientId]);

  useEffect(() => {
    if (!googleReady || !googleClientId || !googleButtonRef.current || googleRenderedRef.current) return;
    if (!window.google?.accounts?.id) return;
    window.google.accounts.id.initialize({ client_id: googleClientId, callback: handleGoogleCredential, ux_mode: 'popup' });
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      type: 'standard', theme: 'outline', size: 'large', text: 'continue_with', shape: 'pill', logo_alignment: 'left', width: 340
    });
    googleRenderedRef.current = true;
  }, [googleReady, googleClientId]);

  async function handleGoogleCredential(response) {
    try {
      if (!response?.credential) return setMessage({ type: 'error', text: 'Google sign-in failed.' });
      const res = await fetch(`${API}/api/auth/google`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential: response.credential })
      });
      const data = await res.json();
      if (!data.ok) return setMessage({ type: 'error', text: data.message || 'Google sign-in failed.' });
      onAuth(data.user);
    } catch (e) { setMessage({ type: 'error', text: e.message }); }
  }

  async function login() {
    setMessage(null);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (!data.ok) return setMessage({ type: 'error', text: data.message });
      onAuth(data.user);
    } catch (e) { setMessage({ type: 'error', text: e.message }); }
  }

  async function signup() {
    setMessage(null);
    if (!signupForm.agree) return setMessage({ type: 'error', text: 'Please agree to the terms to continue.' });
    if (signupForm.password !== signupForm.password2) return setMessage({ type: 'error', text: 'Passwords do not match.' });
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signupForm.name, username: signupForm.username, email: signupForm.email, password: signupForm.password })
      });
      const data = await res.json();
      if (!data.ok) return setMessage({ type: 'error', text: data.message });
      setMessage({ type: 'success', text: '✅ Account created! You can now log in.' });
      setTab('login');
    } catch (e) { setMessage({ type: 'error', text: e.message }); }
  }

  return (
    <div className="grid">
      <div className="section">
        <h2>🔐 Resume Analyzer — Secure Access Portal</h2>
        <div className="columns" style={{ marginTop: 12 }}>
          <button onClick={() => setTab('login')} style={{ opacity: tab==='login'?1:0.6 }}>Login</button>
          <button onClick={() => setTab('signup')} style={{ opacity: tab==='signup'?1:0.6 }}>Sign Up</button>
        </div>
        <div style={{ marginTop: 16 }}>
          {tab === 'login' ? (
            <div>
              <input type="text" placeholder="Username" value={loginForm.username} onChange={e=>setLoginForm(f=>({...f, username: e.target.value}))} />
              <div style={{ height: 8 }} />
              <input type="password" placeholder="Password" value={loginForm.password} onChange={e=>setLoginForm(f=>({...f, password: e.target.value}))} />
              <div style={{ height: 12 }} />
              <button onClick={login}>Login</button>
            </div>
          ) : (
            <div>
              <input type="text" placeholder="Full Name" value={signupForm.name} onChange={e=>setSignupForm(f=>({...f, name: e.target.value}))} />
              <div style={{ height: 8 }} />
              <input type="text" placeholder="Username" value={signupForm.username} onChange={e=>setSignupForm(f=>({...f, username: e.target.value}))} />
              <div style={{ height: 8 }} />
              <input type="email" placeholder="Email" value={signupForm.email} onChange={e=>setSignupForm(f=>({...f, email: e.target.value}))} />
              <div style={{ height: 8 }} />
              <input type="password" placeholder="Password" value={signupForm.password} onChange={e=>setSignupForm(f=>({...f, password: e.target.value}))} />
              <div style={{ height: 8 }} />
              <input type="password" placeholder="Confirm Password" value={signupForm.password2} onChange={e=>setSignupForm(f=>({...f, password2: e.target.value}))} />
              <div style={{ height: 8 }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={signupForm.agree} onChange={e=>setSignupForm(f=>({...f, agree: e.target.checked}))} /> I agree to the Terms and Privacy Policy
              </label>
              <div style={{ height: 12 }} />
              <button onClick={signup}>Create Account</button>
            </div>
          )}

          <div style={{ marginTop: 14, display: 'grid', gap: 6, justifyItems: 'center' }}>
            <div ref={googleButtonRef} aria-label="Sign in with Google" />
            {!googleClientId && <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>Add VITE_GOOGLE_CLIENT_ID to enable Google sign-in.</p>}
          </div>
        </div>
        {message && (
          <div className="section" style={{ marginTop: 12, background: 'rgba(14,165,233,0.1)' }}>
            {message.text}
          </div>
        )}
      </div>

      <div className="sidebar">
        <h3>📋 How It Works</h3>
        <p>1️⃣ Paste Job Description</p>
        <p>2️⃣ Upload Resume (PDF)</p>
        <p>3️⃣ Run Analysis</p>
        <p>4️⃣ Get Results & Download</p>
        <hr />
        <h4>💡 Tips</h4>
        <p className="small">Use text-based PDFs; include complete job descriptions; keep resumes under 10 pages.</p>
        <hr />
        <h4>⚙️ Tech Stack</h4>
        <p className="small">Frontend: React • Backend: Express • AI: Gemini</p>
      </div>
    </div>
  );
}
