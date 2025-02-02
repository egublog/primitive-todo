import { TodoController } from './controllers/TodoController.js';

/**
 * アプリケーションの設定
 */
const APP_CONFIG = {
  debug: false,
  version: '1.0.0',
  storagePrefix: 'primitive-todo_'
};

/**
 * グローバルエラーハンドラー
 * @param {Error} error エラーオブジェクト
 */
function handleGlobalError(error) {
  console.error('[App Error]', error);
  
  // エラーメッセージの表示
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message global-error';
  errorDiv.setAttribute('role', 'alert');
  errorDiv.innerHTML = `
    <strong>エラーが発生しました</strong>
    <p>${error.message}</p>
  `;
  
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
}

/**
 * パフォーマンスの監視
 * @param {string} label パフォーマンスマーカーのラベル
 */
function measurePerformance(label) {
  if (APP_CONFIG.debug) {
    console.log(`[Performance] ${label}: ${performance.now()}ms`);
  }
}

/**
 * アプリケーションの初期化
 */
async function initializeApp() {
  try {
    measurePerformance('App initialization start');

    // ブラウザの互換性チェック
    if (!window.localStorage || !window.JSON || !window.Promise) {
      throw new Error('お使いのブラウザはサポートされていません。');
    }

    // ServiceWorkerの登録(オフライン対応)
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('ServiceWorker registered');
      } catch (error) {
        console.warn('ServiceWorker registration failed:', error);
      }
    }

    // グローバルイベントハンドラーの設定
    window.addEventListener('error', (event) => {
      handleGlobalError(event.error);
      event.preventDefault();
    });

    window.addEventListener('unhandledrejection', (event) => {
      handleGlobalError(event.reason);
      event.preventDefault();
    });

    // オフライン状態の監視
    window.addEventListener('online', () => {
      document.body.classList.remove('offline');
    });
    
    window.addEventListener('offline', () => {
      document.body.classList.add('offline');
    });

    // パフォーマンス最適化
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // 非重要な初期化処理をアイドル時に実行
        prefetchAssets();
        cleanupStorage();
      });
    }

    // テーマと言語の初期化
    initializeTheme();
    initializeLanguage();

    // flatpickrの初期化
    initializeFlatpickr();

    // コントローラーの初期化
    const controller = new TodoController();
    window.todoApp = APP_CONFIG.debug ? controller : undefined;

    // テーマと言語切り替えボタンのイベントリスナー設定
    const themeToggleBtn = document.getElementById('toggleTheme');
    const langToggleBtn = document.getElementById('toggleLang');
    
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', toggleLanguage);
    }

    measurePerformance('App initialization complete');
  } catch (error) {
    handleGlobalError(error);
  }
}

/**
 * 言語の初期化
 */
function initializeLanguage() {
  const savedLang = localStorage.getItem(`${APP_CONFIG.storagePrefix}lang`) || 'ja';
  document.documentElement.setAttribute('data-lang', savedLang);
  updateLanguageText(savedLang);
  updatePageText(savedLang);
}

/**
 * 言語の切り替え
 */
function toggleLanguage() {
  const currentLang = document.documentElement.getAttribute('data-lang');
  const newLang = currentLang === 'en' ? 'ja' : 'en';
  
  document.documentElement.setAttribute('data-lang', newLang);
  localStorage.setItem(`${APP_CONFIG.storagePrefix}lang`, newLang);
  updateLanguageText(newLang);
  
  // ページ上のテキストを更新
  updatePageText(newLang);
  
  // flatpickrの言語を更新
  const input = document.querySelector('#dueDateInput');
  if (input && input._flatpickr) {
    const { translations } = window;
    if (translations && translations[newLang]) {
      const datePicker = input._flatpickr;
      datePicker.set('locale', newLang === 'ja' ? 'ja' : 'en');
      datePicker.set('dateFormat', newLang === 'ja' ? 'Y年m月d日' : 'Y-m-d');
      
      // altInputのプレースホルダーを更新
      const altInput = input.nextElementSibling;
      if (altInput) {
        altInput.placeholder = translations[newLang].datePlaceholder;
      }
      
      // 日付が選択されていない場合は再初期化して新しいプレースホルダーを表示
      if (!datePicker.selectedDates.length) {
        datePicker.clear();
      }
    }
  }
}

/**
 * 言語切り替えボタンのテキスト更新
 * @param {string} lang - 現在の言語 ('ja' または 'en')
 */
function updateLanguageText(lang) {
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
 * @param {string} lang - 現在の言語 ('ja' または 'en')
 */
function updatePageText(lang) {
  const { translations } = window;
  if (!translations || !translations[lang]) return;

  // data-i18n属性を持つ要素の翻訳
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

  // data-ja/data-en属性を持つ要素の翻訳
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

  // プレースホルダーの翻訳
  const inputs = document.querySelectorAll('input[placeholder]');
  inputs.forEach(input => {
    const key = input.getAttribute('data-i18n');
    if (key && translations[lang][key]) {
      input.placeholder = translations[lang][key];
    }
  });

  // aria-labelの翻訳
  const ariaElements = document.querySelectorAll('[aria-label]');
  ariaElements.forEach(element => {
    const key = element.getAttribute('data-i18n-aria');
    if (key && translations[lang][key]) {
      element.setAttribute('aria-label', translations[lang][key]);
    }
  });
}

/**
 * flatpickrの初期化
 */
function initializeFlatpickr() {
  const lang = document.documentElement.getAttribute('data-lang') || 'ja';
  const { translations } = window;
  if (!translations || !translations[lang]) return;

  const datePicker = flatpickr('#dueDateInput', {
    locale: lang === 'ja' ? 'ja' : 'en',
    dateFormat: lang === 'ja' ? 'Y年m月d日' : 'Y-m-d',
    disableMobile: true,
    allowInput: true,
    altInput: true,
    altFormat: lang === 'ja' ? 'Y年m月d日' : 'F j, Y',
    ariaDateFormat: lang === 'ja' ? 'Y年m月d日' : 'F j, Y'
  });

  // プレースホルダーを設定
  const input = document.querySelector('#dueDateInput');
  if (input) {
    const altInput = input.nextElementSibling; // flatpickrが生成した実際の入力フィールド
    if (altInput) {
      altInput.placeholder = translations[lang].datePlaceholder;
    }
  }
}

/**
 * テーマの初期化
 */
function initializeTheme() {
  const savedTheme = localStorage.getItem(`${APP_CONFIG.storagePrefix}theme`) || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

/**
 * テーマの切り替え
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem(`${APP_CONFIG.storagePrefix}theme`, newTheme);
  updateThemeIcon(newTheme);
}

/**
 * テーマアイコンの更新
 * @param {string} theme - 現在のテーマ ('light' または 'dark')
 */
function updateThemeIcon(theme) {
  const themeIcon = document.querySelector('#toggleTheme i');
  if (themeIcon) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

/**
 * アセットのプリフェッチ
 */
function prefetchAssets() {
  // 重要なアセットをプリフェッチ
  const assets = [
    '/styles/themes/dark.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
  ];

  assets.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * 古いストレージデータのクリーンアップ
 */
function cleanupStorage() {
  try {
    const keys = Object.keys(localStorage);
    const prefix = APP_CONFIG.storagePrefix;
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30日

    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        const data = JSON.parse(localStorage.getItem(key));
        if (data.timestamp && Date.now() - data.timestamp > maxAge) {
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.warn('Storage cleanup failed:', error);
  }
}

// アプリケーションの起動
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// 開発者向けデバッグ情報
if (APP_CONFIG.debug) {
  console.log(`
    🚀 Primitive Todo App v${APP_CONFIG.version}
    📝 Debug mode: enabled
    🔧 Environment: development
    ⚡ Performance monitoring: enabled
  `);
}
