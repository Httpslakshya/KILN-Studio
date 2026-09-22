import { apiFetch, API_URL } from './api.js';

const statusEl = document.getElementById('login-status');
const form = document.getElementById('login-form');
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const nameGroup = document.getElementById('name-field-group');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const btnLabel = document.getElementById('btn-label');
const submitBtn = document.getElementById('signin-btn');

let authMode = 'login'; // 'login' | 'signup'

// Check existing session asynchronously so invalid tokens get cleared rather than infinite loops
const existingSession = localStorage.getItem('session_id');
if (existingSession) {
  apiFetch('/api/auth/check')
    .then((res) => {
      if (res && res.data && res.data.authenticated) {
        window.location.href = '/dashboard.html';
      } else {
        localStorage.removeItem('session_id');
      }
    })
    .catch(() => {
      localStorage.removeItem('session_id');
      localStorage.removeItem('docmind_session');
      localStorage.removeItem('kiln_session');
    });
}

function setAuthMode(mode) {
  authMode = mode;
  statusEl.classList.add('hidden');

  if (mode === 'signup') {
    tabSignup.className = 'px-3 py-1 text-xs font-black bg-forge text-white transition';
    tabLogin.className = 'px-3 py-1 text-xs font-black bg-paper text-muted hover:text-ink transition';
    nameGroup.classList.remove('hidden');
    authTitle.textContent = 'Create Account';
    authSubtitle.textContent = 'Register your personal intelligence workspace in KILN Studio.';
    btnLabel.textContent = 'Create Account';
  } else {
    tabLogin.className = 'px-3 py-1 text-xs font-black bg-forge text-white transition';
    tabSignup.className = 'px-3 py-1 text-xs font-black bg-paper text-muted hover:text-ink transition';
    nameGroup.classList.add('hidden');
    authTitle.textContent = 'Welcome back';
    authSubtitle.textContent = 'Enter your workspace to start forging content and querying documents.';
    btnLabel.textContent = 'Enter Forge';
  }
}

tabLogin?.addEventListener('click', () => setAuthMode('login'));
tabSignup?.addEventListener('click', () => setAuthMode('signup'));

function setStatus(message, isError = true) {
  statusEl.textContent = message;
  statusEl.classList.remove('hidden', 'bg-dangerSoft', 'text-danger', 'bg-yellowSoft', 'text-ink');
  statusEl.classList.add(isError ? 'bg-dangerSoft' : 'bg-yellowSoft', isError ? 'text-danger' : 'text-ink');
}

async function handleAuth(payload, isSignup = false) {
  submitBtn.disabled = true;
  const originalLabel = btnLabel.textContent;
  btnLabel.textContent = isSignup ? 'Creating Account...' : 'Authenticating...';

  const endpoint = isSignup ? '/api/signup' : '/api/login';

  try {
    const res = await apiFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (res.data && res.data.session_id) {
      localStorage.setItem('session_id', res.data.session_id);
    }
    window.location.href = res.data?.redirect || '/dashboard.html';
  } catch (err) {
    setStatus(err.message || 'Authentication failed. Please check your credentials.');
    submitBtn.disabled = false;
    btnLabel.textContent = originalLabel;
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const name = document.getElementById('name')?.value.trim() || '';

  if (!email || !password) {
    setStatus('Please enter both email and password.');
    return;
  }

  if (authMode === 'signup') {
    if (password.length < 6) {
      setStatus('Password must be at least 6 characters long.');
      return;
    }
    handleAuth({ email, password, name }, true);
  } else {
    handleAuth({ email, password }, false);
  }
});

// Guest Access
document.getElementById('google-login-btn')?.addEventListener('click', () => {
  handleAuth({ email: 'guest@docmind.local', password: 'demo-access' }, false);
});

// Demo Access
document.getElementById('signup-btn')?.addEventListener('click', () => {
  handleAuth({ email: 'new-user@docmind.local', password: 'demo-access' }, false);
});

// Help button
document.getElementById('forgot-btn')?.addEventListener('click', () => {
  setStatus('Instant access: Click "Continue as Guest" or toggle "Create Account" above to register.', false);
});
