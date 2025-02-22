import { THEME_CONSTANTS } from '../constants/theme.js';

/**
 * テーマ管理サービス
 */
export class ThemeService {
  constructor(storagePrefix = THEME_CONSTANTS.STORAGE_PREFIX) {
    this.storagePrefix = storagePrefix;
  }

  /**
   * テーマの初期化
   */
  initialize() {
    const savedTheme =
      localStorage.getItem(`${this.storagePrefix}theme`) ||
      THEME_CONSTANTS.THEMES.LIGHT;
    document.documentElement.setAttribute(
      THEME_CONSTANTS.ATTRIBUTES.THEME,
      savedTheme
    );
    this.updateThemeIcon(savedTheme);
  }

  /**
   * テーマの切り替え
   */
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute(
      THEME_CONSTANTS.ATTRIBUTES.THEME
    );
    const newTheme =
      currentTheme === THEME_CONSTANTS.THEMES.DARK
        ? THEME_CONSTANTS.THEMES.LIGHT
        : THEME_CONSTANTS.THEMES.DARK;

    document.documentElement.setAttribute(
      THEME_CONSTANTS.ATTRIBUTES.THEME,
      newTheme
    );
    localStorage.setItem(`${this.storagePrefix}theme`, newTheme);
    this.updateThemeIcon(newTheme);
  }

  /**
   * テーマアイコンの更新
   * @param {string} theme - 現在のテーマ
   */
  updateThemeIcon(theme) {
    const themeIcon = document.querySelector("#toggleTheme i");
    if (themeIcon) {
      themeIcon.className =
        theme === THEME_CONSTANTS.THEMES.DARK
          ? THEME_CONSTANTS.ICONS.SUN
          : THEME_CONSTANTS.ICONS.MOON;
    }
  }
}
