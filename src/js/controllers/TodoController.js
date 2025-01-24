import { TodoList } from '../models/TodoList.js';
import { translations } from '../i18n/translations.js';

/**
 * Todoアプリケーションのコントローラークラス
 */
export class TodoController {
  /** @type {Object.<string, HTMLElement>} */
  elements = {};

  /** @type {Object.<string, Function>} */
  handlers = {};

  /**
   * コンストラクタ
   */
  constructor() {
    this.initializeElements();
    this.initializeModel();
    this.initializeHandlers();
    this.setupEventListeners();
    this.initializeUI();
  }

  /**
   * DOM要素の初期化
   * @private
   */
  initializeElements() {
    const elements = {
      todoInput: 'todoInput',
      prioritySelect: 'prioritySelect',
      categorySelect: 'categorySelect',
      categoryFilter: 'categoryFilter',
      dueDateInput: 'dueDateInput',
      addTodoButton: 'addTodo',
      incompleteTodoList: 'incompleteTodoList',
      completedTodoList: 'completedTodoList',
      themeToggleButton: 'toggleTheme',
      langToggleButton: 'toggleLang',
      title: 'appTitle',
      incompleteTag: 'incompleteTag',
      completeTag: 'completeTag'
    };

    for (const [key, id] of Object.entries(elements)) {
      const element = document.getElementById(id);
      if (!element) {
        console.error(`要素が見つかりません: ${id}`);
        continue;
      }
      this.elements[key] = element;
    }
  }

  /**
   * モデルの初期化
   * @private
   */
  initializeModel() {
    this.todoList = new TodoList();
    
    // エラーハンドラーの設定
    this.todoList.onError('add', error => this.showError('追加エラー', error.message));
    this.todoList.onError('update', error => this.showError('更新エラー', error.message));
    this.todoList.onError('load', error => this.showError('読み込みエラー', error.message));
    this.todoList.onError('save', error => this.showError('保存エラー', error.message));

    // モデルの変更を監視
    this.todoList.subscribe(() => this.render());

    // 初期データの読み込み
    this.todoList.load();
  }

  /**
   * イベントハンドラーの初期化
   * @private
   */
  initializeHandlers() {
    this.handlers = {
      addTodo: this.handleAddTodo.bind(this),
      toggleTheme: this.handleThemeToggle.bind(this),
      toggleLanguage: this.handleLanguageToggle.bind(this),
      filterChange: this.handleFilterChange.bind(this),
      keyPress: this.handleKeyPress.bind(this)
    };
  }

  /**
   * UIの初期化
   * @private
   */
  initializeUI() {
    this.initializeDatePicker();
    this.initializeTheme();
    this.initializeAccessibility();
  }

  /**
   * アクセシビリティの初期化
   * @private
   */
  initializeAccessibility() {
    // フォーム要素のラベル関連付け
    this.elements.todoInput.setAttribute('aria-label', '新しいタスク');
    this.elements.addTodoButton.setAttribute('aria-label', 'タスクを追加');

    // ライブリージョンの設定
    this.elements.incompleteTodoList.setAttribute('aria-live', 'polite');
    this.elements.completedTodoList.setAttribute('aria-live', 'polite');

    // キーボードナビゲーションの改善
    this.elements.todoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        this.elements.prioritySelect.focus();
      }
    });
  }

  /**
   * flatpickrの初期化
   * @private
   */
  initializeDatePicker() {
    const lang = this.getCurrentLanguage();
    this.datePicker = flatpickr(this.elements.dueDateInput, {
      dateFormat: 'Y-m-d',
      locale: lang === 'ja' ? 'ja' : 'default',
      disableMobile: true,
      defaultDate: 'today',
      minDate: 'today',
      altInput: true,
      altFormat: lang === 'ja' ? 'Y年m月d日' : 'F j, Y',
      placeholder: translations[lang].datePlaceholder,
      onChange: (selectedDates) => {
        this.elements.dueDateInput.setAttribute(
          'aria-label',
          `選択された日付: ${this.formatDueDate(selectedDates[0], lang)}`
        );
      }
    });
  }

  /**
   * テーマの初期化
   * @private
   */
  initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLang = localStorage.getItem('lang') || 'ja';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('lang', savedLang);
    
    this.updateThemeIcon(savedTheme);
    this.updateLanguage(savedLang);
  }

  /**
   * イベントリスナーの設定
   * @private
   */
  setupEventListeners() {
    // フォームイベント
    this.elements.addTodoButton.addEventListener('click', this.handlers.addTodo);
    this.elements.todoInput.addEventListener('keypress', this.handlers.keyPress);
    this.elements.categoryFilter.addEventListener('change', this.handlers.filterChange);

    // テーマと言語の切り替え
    this.elements.themeToggleButton.addEventListener('click', this.handlers.toggleTheme);
    this.elements.langToggleButton.addEventListener('click', this.handlers.toggleLanguage);

    // フォームのバリデーション
    this.elements.todoInput.addEventListener('input', () => {
      const isValid = this.elements.todoInput.value.trim().length > 0;
      this.elements.addTodoButton.disabled = !isValid;
      this.elements.todoInput.setAttribute('aria-invalid', (!isValid).toString());
    });
  }

  /**
   * エラーメッセージの表示
   * @private
   * @param {string} title エラータイトル
   * @param {string} message エラーメッセージ
   */
  showError(title, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.innerHTML = `
      <strong>${title}</strong>
      <p>${message}</p>
    `;
    
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }

  /**
   * 現在の言語を取得
   * @private
   * @returns {string}
   */
  getCurrentLanguage() {
    return document.documentElement.getAttribute('lang') || 'ja';
  }

  /**
   * 言語の更新
   * @private
   * @param {string} lang
   */
  updateLanguage(lang) {
    localStorage.setItem('lang', lang);

    // テキストの更新
    const elements = {
      title: translations[lang].title,
      todoInput: { placeholder: translations[lang].inputPlaceholder },
      addTodoButton: { textContent: translations[lang].addButton },
      incompleteTag: { textContent: translations[lang].incomplete },
      completeTag: { textContent: translations[lang].completed }
    };

    for (const [key, value] of Object.entries(elements)) {
      if (typeof value === 'string') {
        this.elements[key].textContent = value;
      } else {
        Object.assign(this.elements[key], value);
      }
    }

    // セレクトボックスの更新
    ['prioritySelect', 'categorySelect', 'categoryFilter'].forEach(selectId => {
      this.elements[selectId].querySelectorAll('option').forEach(option => {
        option.textContent = option.getAttribute(`data-${lang}`);
      });
    });

    // flatpickrの更新
    this.datePicker.destroy();
    this.initializeDatePicker();

    // 全てのTodoアイテムを再描画
    this.render();
  }

  /**
   * テーマアイコンの更新
   * @private
   * @param {string} theme
   */
  updateThemeIcon(theme) {
    const icon = this.elements.themeToggleButton.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    this.elements.themeToggleButton.setAttribute(
      'aria-label',
      theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'
    );
  }

  /**
   * イベントハンドラー
   */
  handleAddTodo() {
    const text = this.elements.todoInput.value;
    if (!text.trim()) {
      this.elements.todoInput.setAttribute('aria-invalid', 'true');
      return;
    }

    try {
      this.todoList.addTodo(
        text,
        this.elements.prioritySelect.value,
        this.elements.dueDateInput.value || null,
        this.elements.categorySelect.value
      );
      
      this.elements.todoInput.value = '';
      this.datePicker.setDate(new Date()); // 日付を今日の日付にリセット
      this.elements.todoInput.focus();
    } catch (error) {
      this.showError('追加エラー', error.message);
    }
  }

  handleThemeToggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateThemeIcon(newTheme);
  }

  handleLanguageToggle() {
    const currentLang = this.getCurrentLanguage();
    const newLang = currentLang === 'en' ? 'ja' : 'en';
    document.documentElement.setAttribute('lang', newLang);
    this.updateLanguage(newLang);
  }

  handleFilterChange() {
    this.render();
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.handleAddTodo();
    }
  }

  /**
   * Todo要素の作成
   * @private
   * @param {TodoItem} todo
   * @returns {HTMLElement}
   */
  createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.setAttribute('data-priority', todo.priority);
    li.setAttribute('data-id', todo.id);

    const currentLang = this.getCurrentLanguage();

    // チェックボックス
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `${todo.text}を${todo.completed ? '未完了' : '完了'}にする`);
    checkbox.addEventListener('change', () => this.todoList.toggleTodo(todo.id));

    // テキスト要素
    const todoText = document.createElement('span');
    todoText.className = 'todo-text';
    todoText.textContent = todo.text;
    todoText.setAttribute('role', 'textbox');
    todoText.setAttribute('aria-label', todo.text);

    // 優先度インジケーター
    const priorityIndicator = document.createElement('span');
    priorityIndicator.className = `priority-indicator priority-${todo.priority}`;
    priorityIndicator.textContent = translations[currentLang].priority[todo.priority];
    priorityIndicator.setAttribute('role', 'status');
    todoText.appendChild(priorityIndicator);

    // カテゴリタグ
    const categoryTag = document.createElement('span');
    categoryTag.className = 'category-tag';
    categoryTag.textContent = translations[currentLang].category[todo.category];
    categoryTag.setAttribute('role', 'status');
    todoText.appendChild(categoryTag);

    // 期限表示
    const dueDateSpan = document.createElement('span');
    dueDateSpan.className = 'due-date';
    if (todo.dueDate) {
      if (todo.isExpired()) {
        dueDateSpan.classList.add('expired');
      }
      dueDateSpan.textContent = `${translations[currentLang].dueDate}${this.formatDueDate(todo.dueDate, currentLang)}`;
    } else {
      dueDateSpan.textContent = translations[currentLang].noDueDate;
    }
    dueDateSpan.setAttribute('role', 'status');
    todoText.appendChild(dueDateSpan);

    // 編集機能
    if (!todo.completed) {
      todoText.addEventListener('click', () => this.setupEditMode(li, todo));
      todoText.setAttribute('role', 'button');
      todoText.setAttribute('tabindex', '0');
      todoText.setAttribute('aria-label', `${todo.text}を編集`);
    }

    // 削除ボタン
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = `<i class="fas fa-trash" aria-hidden="true"></i> ${translations[currentLang].deleteButton}`;
    deleteBtn.setAttribute('aria-label', `${todo.text}を削除`);
    deleteBtn.addEventListener('click', () => this.todoList.deleteTodo(todo.id));

    // 要素の組み立て
    li.appendChild(checkbox);
    li.appendChild(todoText);
    li.appendChild(deleteBtn);

    return li;
  }

  /**
   * 編集モードのセットアップ
   * @private
   * @param {HTMLElement} li
   * @param {TodoItem} todo
   */
  setupEditMode(li, todo) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = todo.text;
    input.setAttribute('aria-label', `${todo.text}を編集`);

    const todoText = li.querySelector('.todo-text');
    li.replaceChild(input, todoText);
    input.focus();

    const handleEdit = () => {
      try {
        const success = this.todoList.updateTodo(todo.id, { text: input.value });
        if (!success) {
          li.replaceChild(todoText, input);
        }
      } catch (error) {
        this.showError('更新エラー', error.message);
        li.replaceChild(todoText, input);
      }
    };

    input.addEventListener('blur', handleEdit);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleEdit();
      }
    });
  }

  /**
   * 期限の表示フォーマット
   * @private
   * @param {string|Date} dueDate
   * @param {string} lang
   * @returns {string}
   */
  formatDueDate(dueDate, lang) {
    if (!dueDate) return '';
    const date = new Date(dueDate);
    const options = { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    };
    return date.toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US', options);
  }

  /**
   * UIの更新
   * @private
   */
  render() {
    const selectedCategory = this.elements.categoryFilter.value;
    const sortField = 'priority'; // デフォルトのソート
    
    // 未完了リストの更新
    const incompleteTodos = this.todoList.getFilteredTodos({ 
      completed: false,
      category: selectedCategory === 'all' ? null : selectedCategory
    });
    this.renderTodoList(this.elements.incompleteTodoList, incompleteTodos, sortField);

    // 完了リストの更新
    const completedTodos = this.todoList.getFilteredTodos({
      completed: true,
      category: selectedCategory === 'all' ? null : selectedCategory
    });
    this.renderTodoList(this.elements.completedTodoList, completedTodos, sortField);

    // アクセシビリティ通知
    this.updateAccessibilityStatus(incompleteTodos.length, completedTodos.length);
  }

  /**
   * Todoリストの描画
   * @private
   * @param {HTMLElement} container
   * @param {TodoItem[]} todos
   * @param {string} sortField
   */
  renderTodoList(container, todos, sortField) {
    const sortedTodos = this.todoList.getSortedTodos(sortField);
    const fragment = document.createDocumentFragment();
    
    todos.forEach(todo => {
      fragment.appendChild(this.createTodoElement(todo));
    });

    container.innerHTML = '';
    container.appendChild(fragment);
  }

  /**
   * アクセシビリティステータスの更新
   * @private
   * @param {number} incompleteCount
   * @param {number} completedCount
   */
  updateAccessibilityStatus(incompleteCount, completedCount) {
    const status = document.getElementById('accessibilityStatus') || 
                  (() => {
                    const el = document.createElement('div');
                    el.id = 'accessibilityStatus';
                    el.className = 'visually-hidden';
                    el.setAttribute('role', 'status');
                    el.setAttribute('aria-live', 'polite');
                    document.body.appendChild(el);
                    return el;
                  })();

    const currentLang = this.getCurrentLanguage();
    status.textContent = translations[currentLang].statusMessage
      .replace('{incomplete}', incompleteCount)
      .replace('{completed}', completedCount);
  }
}
