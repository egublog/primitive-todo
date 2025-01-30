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

    // ServiceWorkerの登録（オフライン対応）
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

    // テーマの初期化
    initializeTheme();

    // コントローラーの初期化
    const controller = new TodoController();
    window.todoApp = APP_CONFIG.debug ? controller : undefined;

    // テーマ切り替えボタンのイベントリスナー設定
    const themeToggleBtn = document.getElementById('toggleTheme');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }

    measurePerformance('App initialization complete');
  } catch (error) {
    handleGlobalError(error);
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
