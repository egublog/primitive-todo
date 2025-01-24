// 翻訳データ
const translations = {
  ja: {
    title: 'プリミティブTodo',
    inputPlaceholder: '新しいタスクを入力',
    addButton: '追加',
    incompleteTasks: '未完了のタスク',
    completedTasks: '完了したタスク',
    deleteButton: '削除',
    noDueDate: '期限なし',
    dueDate: '期限：',
    expired: '期限切れ'
  },
  en: {
    title: 'Primitive Todo',
    inputPlaceholder: 'Enter new task',
    addButton: 'Add',
    incompleteTasks: 'Incomplete Tasks',
    completedTasks: 'Completed Tasks',
    deleteButton: 'Delete',
    noDueDate: 'No due date',
    dueDate: 'Due: ',
    expired: 'Expired'
  }
};

// TodoItemの型定義
class TodoItem {
  constructor(text, priority = 'medium', completed = false, dueDate = null) {
    this.text = text;
    this.priority = priority;
    this.completed = completed;
    this.dueDate = dueDate;
    this.id = Date.now().toString(); // ユニークID
  }

  isExpired() {
    if (!this.dueDate || this.completed) return false;
    return new Date(this.dueDate) < new Date();
  }
}

// TodoListのモデル
class TodoList {
  constructor() {
    this.STORAGE_KEY = 'todos';
    this.todos = [];
    this.listeners = new Set();
  }

  // オブザーバーパターンの実装
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener(this.todos));
  }

  // LocalStorageからの読み込み
  load() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.todos = data.map(item => Object.assign(new TodoItem(''), item));
        this.notify();
      }
    } catch (error) {
      console.error('データの読み込みに失敗しました:', error);
    }
  }

  // LocalStorageへの保存
  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos));
    } catch (error) {
      console.error('データの保存に失敗しました:', error);
    }
  }

  // Todo追加
  addTodo(text, priority, dueDate) {
    if (!text.trim()) return false;
    
    const todo = new TodoItem(text, priority, false, dueDate);
    this.todos.push(todo);
    this.save();
    this.notify();
    return true;
  }

  // Todo削除
  deleteTodo(id) {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.save();
      this.notify();
    }
  }

  // 完了状態の切り替え
  toggleTodo(id) {
    const todo = this.todos.find(todo => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.save();
      this.notify();
    }
  }

  // テキストの更新
  updateTodoText(id, newText) {
    if (!newText.trim()) return false;
    
    const todo = this.todos.find(todo => todo.id === id);
    if (todo) {
      todo.text = newText;
      this.save();
      this.notify();
      return true;
    }
    return false;
  }

  // フィルター済みのTodoリストを取得
  getFilteredTodos(completed) {
    return this.todos.filter(todo => todo.completed === completed);
  }
}

// UIコントローラー
class TodoController {
  constructor() {
    // DOMの参照を保持
    this.todoInput = document.getElementById('todoInput');
    this.prioritySelect = document.getElementById('prioritySelect');
    this.dueDateInput = document.getElementById('dueDateInput');
    this.addTodoButton = document.getElementById('addTodo');
    this.incompleteTodoList = document.getElementById('incompleteTodoList');
    this.completedTodoList = document.getElementById('completedTodoList');
    this.themeToggleButton = document.getElementById('toggleTheme');

    // モデルのインスタンス化
    this.todoList = new TodoList();

    // イベントリスナーの設定
    this.setupEventListeners();

    // 初期データの読み込み
    this.todoList.load();

    // テーマの初期化
    this.initializeTheme();

    // モデルの変更を監視
    this.todoList.subscribe(() => this.render());
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
    document.querySelector('.incomplete-tag').textContent = translations[lang].incompleteTasks;
    document.querySelector('.complete-tag').textContent = translations[lang].completedTasks;
    
    // 既存のTodoアイテムの削除ボタンテキストを更新
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.textContent = translations[lang].deleteButton;
    });
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
    this.themeToggleButton.textContent = theme === 'dark' ? '☀️' : '🌙';
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

    // テーマと言語切り替えボタンのイベント
    this.themeToggleButton.addEventListener('click', () => this.toggleTheme());
    document.getElementById('toggleLang').addEventListener('click', () => this.toggleLanguage());
  }

  handleAddTodo() {
    const success = this.todoList.addTodo(
      this.todoInput.value,
      this.prioritySelect.value,
      this.dueDateInput.value || null
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

    // テキスト要素
    const todoText = document.createElement('span');
    todoText.className = 'todo-text';
    todoText.textContent = todo.text;

    // 優先度インジケーター
    const priorityIndicator = document.createElement('span');
    priorityIndicator.className = `priority-indicator priority-${todo.priority}`;
    priorityIndicator.textContent = {
      high: '高',
      medium: '中',
      low: '低'
    }[todo.priority];
    todoText.appendChild(priorityIndicator);

    // 期限表示
    if (todo.dueDate) {
      const currentLang = document.documentElement.getAttribute('lang') || 'ja';
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
    const currentLang = document.documentElement.getAttribute('lang') || 'ja';
    deleteBtn.textContent = translations[currentLang].deleteButton;
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
    // 未完了リストの更新
    this.incompleteTodoList.innerHTML = '';
    this.todoList.getFilteredTodos(false).forEach(todo => {
      const element = this.createTodoElement(todo);
      this.incompleteTodoList.appendChild(element);
    });

    // 完了リストの更新
    this.completedTodoList.innerHTML = '';
    this.todoList.getFilteredTodos(true).forEach(todo => {
      const element = this.createTodoElement(todo);
      this.completedTodoList.appendChild(element);
    });
  }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
  new TodoController();
});
