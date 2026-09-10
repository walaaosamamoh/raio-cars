import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'light',
  }),

  getters: {
    isDark: (state) => state.theme === 'dark',
  },

  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      this.updateDOMAndLocalStorage();
    },

    applyInitialTheme() {
      this.updateDOMAndLocalStorage();
    },

    updateDOMAndLocalStorage() {
      localStorage.setItem('theme', this.theme);
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
});