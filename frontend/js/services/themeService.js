/**
 * テーマ管理サービス
 */
export class ThemeService {
  constructor(storagePrefix = 'primitive-todo_') {
    this.storagePrefix = storagePrefix;
  }

  /**
   * テーマの初期化
   */
  initialize() {
    const savedTheme = localStorage.getItem(`${this.storagePrefix}theme`) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);
  }

  /**
   * テーマの切り替え
   */
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(`${this.storagePrefix}theme`, newTheme);
    this.updateThemeIcon(newTheme);
  }

  /**
   * テーマアイコンの更新
   * @param {string} theme - 現在のテーマ
   */
  updateThemeIcon(theme) {
    const themeIcon = document.querySelector('#toggleTheme i');
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }
}
