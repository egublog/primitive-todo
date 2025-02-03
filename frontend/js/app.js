import { TodoController } from './controllers/TodoController.js';
import { I18nService } from './services/i18nService.js';
import { ThemeService } from './services/themeService.js';
import { AppInitializer } from './services/appInitializer.js';

// アプリケーションの初期化
const APP_CONFIG = {
  debug: false,
  version: '1.0.0',
  storagePrefix: 'primitive-todo_'
};

// サービスのインスタンス化
const i18nService = new I18nService(APP_CONFIG.storagePrefix);
const themeService = new ThemeService(APP_CONFIG.storagePrefix);
const appInitializer = new AppInitializer(APP_CONFIG);

// アプリケーションの起動
async function startApp() {
  try {
    await appInitializer.initialize(i18nService, themeService);
    const controller = new TodoController();
    window.todoApp = APP_CONFIG.debug ? controller : undefined;
  } catch (error) {
    appInitializer.handleError(error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
