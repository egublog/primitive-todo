import { TodoList } from '../models/TodoList.js';
import { translations } from '../i18n/translations.js';

export class TodoController {
  constructor() {
    // DOMの参照を保持
    this.todoInput = document.getElementById('todoInput');
    this.prioritySelect = document.getElementById('prioritySelect');
    this.categorySelect = document.getElementById('categorySelect');
    this.categoryFilter = document.getElementById('categoryFilter');
    this.dueDateInput = document.getElementById('dueDateInput');
    this.addTodoButton = document.getElementById('addTodo');
    this.incompleteTodoList = document.getElementById('incompleteTodoList');
    this.completedTodoList = document.getElementById('completedTodoList');
    this.themeToggleButton = document.getElementById('toggleTheme');

    // モデルのインスタンス化
    this.todoList = new TodoList();

    // flatpickrの初期化
    this.initializeDatePicker();

    // イベントリスナーの設定
    this.setupEventListeners();

    // テーマの初期化
    this.initializeTheme();

    // モデルの変更を監視（loadの前に設定）
    this.todoList.subscribe(() => this.render());

    // 初期データの読み込み（subscribeの後に実行）
    this.todoList.load();
  }

  // flatpickrの初期化
  initializeDatePicker() {
    const lang = localStorage.getItem('lang') || 'ja';
    this.datePicker = flatpickr(this.dueDateInput, {
      dateFormat: 'Y-m-d',
      locale: lang === 'ja' ? 'ja' : 'default',
      disableMobile: true,
      defaultDate: 'today',
      minDate: 'today',
      altInput: true,
      altFormat: lang === 'ja' ? 'Y年m月d日' : 'F j, Y',
      placeholder: lang === 'ja' ? '期限を選択' : 'Select due date'
    });
  }

  // 言語とテーマの初期化
  initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLang = localStorage.getItem('lang') || 'ja';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('lang', savedLang);
    this.updateThemeIcon(savedTheme);
    this.updateLanguage(savedLang);
  }

  // 言語の更新
  updateLanguage(lang) {
    localStorage.setItem('lang', lang);
    document.querySelector('h1').textContent = translations[lang].title;
    this.todoInput.placeholder = translations[lang].inputPlaceholder;
    this.addTodoButton.textContent = translations[lang].addButton;
    document.querySelector('.incomplete-tag').textContent = translations[lang].incomplete;
    document.querySelector('.complete-tag').textContent = translations[lang].completed;
    
    // 優先度選択肢の更新
    document.querySelectorAll('#prioritySelect option').forEach(option => {
      option.textContent = option.getAttribute(`data-${lang}`);
    });

    // カテゴリ選択肢の更新
    document.querySelectorAll('#categorySelect option, #categoryFilter option').forEach(option => {
      option.textContent = option.getAttribute(`data-${lang}`);
    });

    // flatpickrのロケールを更新
    this.datePicker.destroy();
    this.datePicker = flatpickr(this.dueDateInput, {
      dateFormat: 'Y-m-d',
      locale: lang === 'ja' ? 'ja' : 'default',
      disableMobile: true,
      defaultDate: 'today',
      minDate: 'today',
      altInput: true,
      altFormat: lang === 'ja' ? 'Y年m月d日' : 'F j, Y',
      placeholder: lang === 'ja' ? '期限を選択' : 'Select due date'
    });

    // 全てのTodoアイテムを再描画して言語を更新
    this.render();
  }

  // 言語の切り替え
  toggleLanguage() {
    const currentLang = document.documentElement.getAttribute('lang');
    const newLang = currentLang === 'en' ? 'ja' : 'en';
    document.documentElement.setAttribute('lang', newLang);
    this.updateLanguage(newLang);
  }

  // テーマアイコンの更新
  updateThemeIcon(theme) {
    const icon = this.themeToggleButton.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  // テーマの切り替え
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateThemeIcon(newTheme);
  }

  setupEventListeners() {
    // 追加ボタンのイベント
    this.addTodoButton.addEventListener('click', () => this.handleAddTodo());

    // Enter キーでの追加
    this.todoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleAddTodo();
      }
    });

    // カテゴリフィルターのイベント
    this.categoryFilter.addEventListener('change', () => this.render());

    // テーマと言語切り替えボタンのイベント
    this.themeToggleButton.addEventListener('click', () => this.toggleTheme());
    document.getElementById('toggleLang').addEventListener('click', () => this.toggleLanguage());
  }

  handleAddTodo() {
    const success = this.todoList.addTodo(
      this.todoInput.value,
      this.prioritySelect.value,
      this.dueDateInput.value || null,
      this.categorySelect.value
    );
    if (success) {
      this.todoInput.value = '';
      this.dueDateInput.value = '';
    }
  }

  // 期限の表示フォーマット
  formatDueDate(dueDate, lang) {
    if (!dueDate) return '';
    const date = new Date(dueDate);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US', options);
  }

  // Todo要素の作成
  createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.setAttribute('data-priority', todo.priority);
    // チェックボックス
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => this.todoList.toggleTodo(todo.id));

    const currentLang = document.documentElement.getAttribute('lang') || 'ja';

    // テキスト要素
    const todoText = document.createElement('span');
    todoText.className = 'todo-text';
    todoText.textContent = todo.text;

    // 優先度インジケーター
    const priorityIndicator = document.createElement('span');
    priorityIndicator.className = `priority-indicator priority-${todo.priority}`;
    priorityIndicator.textContent = translations[currentLang].priority[todo.priority];
    todoText.appendChild(priorityIndicator);

    // カテゴリタグ
    const categoryTag = document.createElement('span');
    categoryTag.className = 'category-tag';
    categoryTag.textContent = translations[currentLang].category[todo.category];
    todoText.appendChild(categoryTag);

    // 期限表示
    if (todo.dueDate) {
      const dueDateSpan = document.createElement('span');
      dueDateSpan.className = `due-date ${todo.isExpired() ? 'expired' : ''}`;
      dueDateSpan.textContent = `${translations[currentLang].dueDate}${this.formatDueDate(todo.dueDate, currentLang)}`;
      todoText.appendChild(dueDateSpan);
    }

    // 編集機能
    if (!todo.completed) {
      todoText.addEventListener('click', () => this.setupEditMode(li, todo));
    }

    // 削除ボタン
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = `<i class="fas fa-trash"></i> ${translations[currentLang].deleteButton}`;
    deleteBtn.addEventListener('click', () => this.todoList.deleteTodo(todo.id));

    // 要素の組み立て
    li.appendChild(checkbox);
    li.appendChild(todoText);
    li.appendChild(deleteBtn);

    return li;
  }

  // 編集モードのセットアップ
  setupEditMode(li, todo) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = todo.text;

    const todoText = li.querySelector('.todo-text');
    li.replaceChild(input, todoText);
    input.focus();

    const handleEdit = () => {
      const success = this.todoList.updateTodoText(todo.id, input.value);
      if (!success) {
        li.replaceChild(todoText, input);
      }
    };

    input.addEventListener('blur', handleEdit);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleEdit();
      }
    });
  }

  // UIの更新
  render() {
    const selectedCategory = this.categoryFilter.value;

    // 未完了リストの更新
    this.incompleteTodoList.innerHTML = '';
    this.todoList.getFilteredTodos(false, selectedCategory).forEach(todo => {
      const element = this.createTodoElement(todo);
      this.incompleteTodoList.appendChild(element);
    });

    // 完了リストの更新
    this.completedTodoList.innerHTML = '';
    this.todoList.getFilteredTodos(true, selectedCategory).forEach(todo => {
      const element = this.createTodoElement(todo);
      this.completedTodoList.appendChild(element);
    });
  }
}
