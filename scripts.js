// === CONFIG - set to your Apps Script Web App URL ===
const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwZ7QXXlUAF-MZJeO9e-1GWXMPcIPxvhBkxqOA76OpKMgEG_zAU2j8i9ogsWqsyjT_bpQ/exec";

// Mobile menu toggle
document.getElementById('menuBtn')?.addEventListener('click', () => {
  const nav = document.getElementById('nav');
  if (nav.style.display === 'flex') nav.style.display = '';
  else nav.style.display = 'flex';
});

// Portfolio filter
function filterCategory(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
  });
}

// Initialize show all
document.addEventListener('DOMContentLoaded', () => {
  filterCategory('all');
});

// Email subscription (Home)
async function submitEmailForm(evt) {
  evt.preventDefault();
  const emailInput = document.getElementById('emailInput');
  const msg = document.getElementById('emailMsg');
  const email = emailInput.value.trim();
  if (!email) { msg.textContent = 'Enter a valid email.'; return; }
  msg.textContent = 'Sending...';

  try {
    const res = await fetch(APPS_SCRIPT_WEB_APP_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({action: 'saveEmail', email})
    });
    const data = await res.json();
    if (data.success) { msg.textContent = 'Thanks — subscribed!'; emailInput.value = ''; }
    else msg.textContent = 'Error: ' + (data.error || 'Could not save email.');
  } catch (e) {
    console.error(e);
    msg.textContent = 'Network error. Try later.';
  }
}

// Contact form
async function submitContactForm(evt) {
  evt.preventDefault();
  const name = document.getElementById('contactName')?.value?.trim() || '';
  const email = document.getElementById('contactEmail')?.value?.trim() || '';
  const phone = document.getElementById('contactPhone')?.value?.trim() || '';
  const message = document.getElementById('contactMessage')?.value?.trim() || '';
  const msgBox = document.getElementById('contactMsg');

  if (!name || !email || !message) { msgBox.textContent = 'Name, email and message are required.'; return; }
  msgBox.textContent = 'Sending...';

  try {
    const res = await fetch(APPS_SCRIPT_WEB_APP_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({action: 'saveContact', name, email, phone, message})
    });
    const data = await res.json();
    if (data.success) { msgBox.textContent = 'Message sent — we will contact you.'; document.getElementById('contactForm')?.reset(); }
    else msgBox.textContent = 'Error: ' + (data.error || 'Could not send message.');
  } catch (e) {
    console.error(e);
    msgBox.textContent = 'Network error. Try later.';
  }
}
