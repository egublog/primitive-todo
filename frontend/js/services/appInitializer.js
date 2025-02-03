/**
 * アプリケーション初期化サービス
 */
export class AppInitializer {
  constructor(config = {}) {
    this.config = {
      debug: false,
      version: '1.0.0',
      storagePrefix: 'primitive-todo_',
      ...config
    };
  }

  /**
   * アプリケーションの初期化
   * @param {I18nService} i18nService - 国際化サービス
   * @param {ThemeService} themeService - テーマサービス
   */
  async initialize(i18nService, themeService) {
    try {
      this.measurePerformance('App initialization start');

      // 基本チェック
      this.checkBrowserCompatibility();
      
      // ServiceWorkerの登録
      await this.registerServiceWorker();

      // グローバルイベントハンドラーの設定
      this.setupGlobalEventHandlers();
      
      // オフライン状態の監視
      this.setupOfflineDetection();

      // 最適化処理
      this.setupOptimizations();

      // 各種サービスの初期化
      themeService.initialize();
      i18nService.initialize();
      this.initializeFlatpickr();

      // イベントリスナーの設定
      this.setupEventListeners(i18nService, themeService);

      this.measurePerformance('App initialization complete');
      
      // デバッグ情報の表示
      this.logDebugInfo();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * ブラウザの互換性チェック
   */
  checkBrowserCompatibility() {
    if (!window.localStorage || !window.JSON || !window.Promise) {
      throw new Error('お使いのブラウザはサポートされていません。');
    }
  }

  /**
   * ServiceWorkerの登録
   */
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('ServiceWorker registered');
      } catch (error) {
        console.warn('ServiceWorker registration failed:', error);
      }
    }
  }

  /**
   * グローバルエラーハンドラーの設定
   */
  setupGlobalEventHandlers() {
    window.addEventListener('error', (event) => {
      this.handleError(event.error);
      event.preventDefault();
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason);
      event.preventDefault();
    });
  }

  /**
   * オフライン状態の監視設定
   */
  setupOfflineDetection() {
    window.addEventListener('online', () => {
      document.body.classList.remove('offline');
    });
    
    window.addEventListener('offline', () => {
      document.body.classList.add('offline');
    });
  }

  /**
   * パフォーマンス最適化の設定
   */
  setupOptimizations() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.prefetchAssets();
        this.cleanupStorage();
      });
    }
  }

  /**
   * イベントリスナーの設定
   */
  setupEventListeners(i18nService, themeService) {
    const themeToggleBtn = document.getElementById('toggleTheme');
    const langToggleBtn = document.getElementById('toggleLang');
    
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => themeService.toggleTheme());
    }
    
    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', () => i18nService.toggleLanguage());
    }
  }

  /**
   * flatpickrの初期化
   */
  initializeFlatpickr() {
    const lang = document.documentElement.getAttribute('data-lang') || 'ja';
    const { translations } = window;
    if (!translations || !translations[lang]) return;

    flatpickr('#dueDateInput', {
      locale: lang === 'ja' ? 'ja' : 'en',
      dateFormat: lang === 'ja' ? 'Y年m月d日' : 'Y-m-d',
      disableMobile: true,
      allowInput: true,
      altInput: true,
      altFormat: lang === 'ja' ? 'Y年m月d日' : 'F j, Y',
      ariaDateFormat: lang === 'ja' ? 'Y年m月d日' : 'F j, Y'
    });

    const input = document.querySelector('#dueDateInput');
    if (input) {
      const altInput = input.nextElementSibling;
      if (altInput) {
        altInput.placeholder = translations[lang].datePlaceholder;
      }
    }
  }

  /**
   * アセットのプリフェッチ
   */
  prefetchAssets() {
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
  cleanupStorage() {
    try {
      const keys = Object.keys(localStorage);
      const prefix = this.config.storagePrefix;
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

  /**
   * エラーハンドリング
   * @param {Error} error - エラーオブジェクト
   */
  handleError(error) {
    console.error('[App Error]', error);
    
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
   * パフォーマンスの計測
   * @param {string} label - パフォーマンスマーカーのラベル
   */
  measurePerformance(label) {
    if (this.config.debug) {
      console.log(`[Performance] ${label}: ${performance.now()}ms`);
    }
  }

  /**
   * デバッグ情報のログ出力
   */
  logDebugInfo() {
    if (this.config.debug) {
      console.log(`
        🚀 Primitive Todo App v${this.config.version}
        📝 Debug mode: enabled
        🔧 Environment: development
        ⚡ Performance monitoring: enabled
      `);
    }
  }
}
