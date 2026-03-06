/**
 * HueX Theme Management
 * Handles light/dark mode persistence and toggling.
 * Default is light mode (matches mobile app style).
 */

const themeManager = {
    init() {
        const savedTheme = localStorage.getItem('huex-theme') || 'light';
        this.applyTheme(savedTheme);
        return savedTheme;
    },

    applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('huex-theme', theme);

        // Update UI if on dashboard
        this.updateUI(theme);
    },

    toggle() {
        const currentTheme = localStorage.getItem('huex-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        return newTheme;
    },

    updateUI(theme) {
        const themeIcon = document.getElementById('theme-icon');
        const themeText = document.getElementById('theme-text');

        if (!themeIcon || !themeText) return;

        if (theme === 'dark') {
            themeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 21v-2.25m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 18.75a6.75 6.75 0 1 1 0-13.5 6.75 6.75 0 0 1 0 13.5Z" />
            </svg>`;
            themeText.textContent = 'Modo Claro';
        } else {
            themeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>`;
            themeText.textContent = 'Modo Oscuro';
        }
    }
};

// Auto-init on load
themeManager.init();
