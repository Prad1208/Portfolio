function toggleTheme() {
    document.body.classList.toggle('light');

    const btn = document.querySelector('.theme-btn');
    if (document.body.classList.contains('light')) {
      btn.textContent = '☀️';
    } else {
      btn.textContent = '🌙';
    }
  }
