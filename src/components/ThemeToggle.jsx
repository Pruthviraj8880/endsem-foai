function ThemeToggle({ theme, onThemeChange }) {
  return (
    <button className="theme-toggle" onClick={onThemeChange} aria-label="Toggle dark and light mode">
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}

export default ThemeToggle;
