import { apiFetch } from './api.js';

const statusEl = document.getElementById('signup-status');
const form = document.getElementById('signup-form');
const signupBtn = document.getElementById('signup-btn');
const btnLabel = document.getElementById('btn-label');
const guestBtn = document.getElementById('guest-btn');

// Check existing session so already-logged-in users jump straight to dashboard
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
    });
}

function setStatus(message, isError = true) {
  statusEl.textContent = message;
  statusEl.classList.remove('hidden', 'bg-dangerSoft', 'text-danger', 'bg-successSoft', 'text-success');
  statusEl.classList.add(
    isError ? 'bg-dangerSoft' : 'bg-successSoft',
    isError ? 'text-danger' : 'text-success'
  );
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();

  // Client-side validations
  if (!name) {
    setStatus('Please enter your full name or creator handle.');
    return;
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    setStatus('Please enter a valid email address.');
    return;
  }

  if (password.length < 6) {
    setStatus('Password must be at least 6 characters long.');
    return;
  }

  if (password !== confirmPassword) {
    setStatus('Passwords do not match. Please re-enter them carefully.');
    return;
  }

  // Set submitting state
  signupBtn.disabled = true;
  const originalText = btnLabel.textContent;
  btnLabel.textContent = 'Creating Workspace...';

  try {
    const res = await apiFetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    setStatus('Account created! Entering workspace...', false);

    if (res.data && res.data.session_id) {
      localStorage.setItem('session_id', res.data.session_id);
    }

    setTimeout(() => {
      window.location.href = res.data?.redirect || '/dashboard.html';
    }, 600);
  } catch (err) {
    setStatus(err.message || 'Unable to register account. Please try again.');
    signupBtn.disabled = false;
    btnLabel.textContent = originalText;
  }
});

// 1-Click Guest demo access
guestBtn?.addEventListener('click', async () => {
  guestBtn.disabled = true;
  guestBtn.innerHTML = '<span class="material-symbols-outlined text-forge animate-spin">sync</span> Launching Guest Workspace...';

  try {
    const res = await apiFetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'guest@docmind.local',
        password: 'demo-access'
      })
    });

    if (res.data && res.data.session_id) {
      localStorage.setItem('session_id', res.data.session_id);
    }
    window.location.href = res.data?.redirect || '/dashboard.html';
  } catch (err) {
    setStatus(err.message || 'Guest access failed. Please try again.');
    guestBtn.disabled = false;
    guestBtn.innerHTML = '<span class="material-symbols-outlined text-forge">local_fire_department</span> Continue as Guest (1-Click)';
  }
});
