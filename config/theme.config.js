// config/theme.config.js
export function initTheme() {
  const themeBtn = document.getElementById('theme-btn');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('bitcrack_theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  themeBtn.textContent = savedTheme === 'dark' ? '☀️ LIGHT' : '🌙 DARK';

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('bitcrack_theme', newTheme);
    themeBtn.textContent = newTheme === 'dark' ? '☀️ LIGHT' : '🌙 DARK';
  });
}