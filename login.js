/**
 * MindCare AI - Fixed Login Logic
 */

// 1. Role Switching Functionality
const tabs = document.querySelectorAll('.role-tab');
const panels = document.querySelectorAll('.role-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const role = tab.dataset.role;

    // Update Tab UI
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    // Switch Visible Panel
    panels.forEach(p => p.classList.remove('active'));
    const targetPanel = document.getElementById('panel-' + role);
    if (targetPanel) targetPanel.classList.add('active');

    // Update Body Attribute
    document.body.dataset.role = role;

    // Reset Doctor MFA state if switching away
    if (role !== 'doctor') {
      const mfaSection = document.getElementById('mfa-section');
      if (mfaSection) mfaSection.style.display = 'none';
      doctorStep = 1;
    }
  });
});

// 2. Password Visibility Toggle
function togglePwd(id, btn) {
  const inp = document.getElementById(id);
  if (!inp) return;

  const isText = inp.type === 'text';
  inp.type = isText ? 'password' : 'text';

  btn.innerHTML = isText
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
}

// 3. Updated Generic Login Handling with Redirection
function handleLogin(btn, label, role) {
  const emailInput = document.getElementById(role === 'patient' ? 'p-email' : (role === 'caregiver' ? 'c-email' : 'd-email'))?.value;
  const passInput = document.getElementById(role === 'patient' ? 'p-pass' : (role === 'caregiver' ? 'c-pass' : 'd-pass'))?.value;

  const DEMO_EMAIL = "test@mindcare.com";
  const DEMO_PASS = "demo123";

  btn.classList.add('loading');

  setTimeout(() => {
    btn.classList.remove('loading');

    if (emailInput === DEMO_EMAIL && passInput === DEMO_PASS) {
      btn.style.background = '#42b983';
      btn.innerHTML = `<span>Redirecting...</span>`;

      if (role === 'patient') {
        window.location.href = 'Patientdash.html';
      } else if (role === 'caregiver') {
        window.location.href = 'Cargiver.html';
      } else if (role === 'doctor') {
        window.location.href = 'Doctor.html';
      }
    } else {
      alert("Invalid credentials. Use: test@mindcare.com / demo123");
      btn.style.background = '';
      // Reset button text if login fails
      btn.innerHTML = `<span class="btn-text">Secure Sign In</span>`;
    }
  }, 1500);
}

// 4. Fixed Doctor Multi-Step Login
let doctorStep = 1;
function handleDoctorLogin(btn) {
  const mfaSection = document.getElementById('mfa-section');
  const btnText = btn.querySelector('.btn-text');

  if (doctorStep === 1) {
    btn.classList.add('loading');

    setTimeout(() => {
      btn.classList.remove('loading');
      if (mfaSection) mfaSection.style.display = 'block';
      if (btnText) btnText.innerHTML = `Verify & Access Portal`;

      doctorStep = 2;
      const firstOtp = document.querySelector('.otp-input');
      if (firstOtp) firstOtp.focus();
    }, 1400);
  } else {
    handleLogin(btn, 'Verify & Access Portal', 'doctor');
  }
}

// 5. OTP Input Auto-Advance Logic
const otpInputs = document.querySelectorAll('.otp-input');
otpInputs.forEach((inp, i) => {
  inp.addEventListener('input', () => {
    if (inp.value && i < otpInputs.length - 1) {
      otpInputs[i + 1].focus();
    }
  });

  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !inp.value && i > 0) {
      otpInputs[i - 1].focus();
    }
  });
});