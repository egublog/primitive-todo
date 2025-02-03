/**
 * 国際化(i18n)サービス
 */
export class I18nService {
  constructor(storagePrefix = 'primitive-todo_') {
    this.storagePrefix = storagePrefix;
  }

  /**
   * 言語の初期化
   */
  initialize() {
    const savedLang = localStorage.getItem(`${this.storagePrefix}lang`) || 'ja';
    document.documentElement.setAttribute('data-lang', savedLang);
    this.updateLanguageText(savedLang);
    this.updatePageText(savedLang);
  }

  /**
   * 言語の切り替え
   */
  toggleLanguage() {
    const currentLang = document.documentElement.getAttribute('data-lang');
    const newLang = currentLang === 'en' ? 'ja' : 'en';
    
    document.documentElement.setAttribute('data-lang', newLang);
    localStorage.setItem(`${this.storagePrefix}lang`, newLang);
    this.updateLanguageText(newLang);
    this.updatePageText(newLang);
    
    // flatpickrの言語を更新
    this.updateFlatpickrLanguage(newLang);
  }

  /**
   * flatpickrの言語設定を更新
   * @param {string} lang - 言語コード
   */
  updateFlatpickrLanguage(lang) {
    const input = document.querySelector('#dueDateInput');
    if (input && input._flatpickr) {
      const { translations } = window;
      if (translations && translations[lang]) {
        const datePicker = input._flatpickr;
        datePicker.set('locale', lang === 'ja' ? 'ja' : 'en');
        datePicker.set('dateFormat', lang === 'ja' ? 'Y年m月d日' : 'Y-m-d');
        
        const altInput = input.nextElementSibling;
        if (altInput) {
          altInput.placeholder = translations[lang].datePlaceholder;
        }
        
        if (!datePicker.selectedDates.length) {
          datePicker.clear();
        }
      }
    }
  }

  /**
   * 言語切り替えボタンのテキスト更新
   * @param {string} lang - 現在の言語
   */
  updateLanguageText(lang) {
    const langButton = document.getElementById('toggleLang');
    if (langButton) {
      const span = langButton.querySelector('span');
      if (span) {
        span.textContent = lang === 'en' ? '日本語' : 'English';
      }
    }
  }

  /**
   * ページ上のテキストを更新
   * @param {string} lang - 現在の言語
   */
  updatePageText(lang) {
    const { translations } = window;
    if (!translations || !translations[lang]) return;

    // data-i18n属性を持つ要素の翻訳
    this.translateElements(lang, translations);
    
    // selectの翻訳
    this.translateSelects(lang);
    
    // プレースホルダーの翻訳
    this.translatePlaceholders(lang, translations);
    
    // aria-labelの翻訳
    this.translateAriaLabels(lang, translations);
  }

  /**
   * data-i18n属性を持つ要素の翻訳
   * @param {string} lang - 現在の言語
   * @param {object} translations - 翻訳データ
   */
  translateElements(lang, translations) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const keys = key.split('.');
      let value = translations[lang];
      
      for (const k of keys) {
        if (value && value[k]) {
          value = value[k];
        } else {
          value = key;
          break;
        }
      }
      
      if (typeof value === 'string') {
        element.textContent = value;
      }
    });
  }

  /**
   * select要素の翻訳
   * @param {string} lang - 現在の言語
   */
  translateSelects(lang) {
    const selectElements = document.querySelectorAll('select');
    selectElements.forEach(select => {
      const options = select.querySelectorAll('option');
      options.forEach(option => {
        const translatedText = option.getAttribute(`data-${lang}`);
        if (translatedText) {
          option.textContent = translatedText;
        }
      });
    });
  }

  /**
   * プレースホルダーの翻訳
   * @param {string} lang - 現在の言語
   * @param {object} translations - 翻訳データ
   */
  translatePlaceholders(lang, translations) {
    const inputs = document.querySelectorAll('input[placeholder]');
    inputs.forEach(input => {
      const key = input.getAttribute('data-i18n');
      if (key && translations[lang][key]) {
        input.placeholder = translations[lang][key];
      }
    });
  }

  /**
   * aria-labelの翻訳
   * @param {string} lang - 現在の言語
   * @param {object} translations - 翻訳データ
   */
  translateAriaLabels(lang, translations) {
    const ariaElements = document.querySelectorAll('[aria-label]');
    ariaElements.forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      if (key && translations[lang][key]) {
        element.setAttribute('aria-label', translations[lang][key]);
      }
    });
  }
}
