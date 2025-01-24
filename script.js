// TodoItemの型定義
class TodoItem {
  constructor(text, completed = false) {
    this.text = text;
    this.completed = completed;
    this.id = Date.now().toString(); // ユニークID
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
  addTodo(text) {
    if (!text.trim()) return false;
    
    const todo = new TodoItem(text);
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
    this.addTodoButton = document.getElementById('addTodo');
    this.incompleteTodoList = document.getElementById('incompleteTodoList');
    this.completedTodoList = document.getElementById('completedTodoList');

    // モデルのインスタンス化
    this.todoList = new TodoList();

    // イベントリスナーの設定
    this.setupEventListeners();

    // 初期データの読み込み
    this.todoList.load();

    // モデルの変更を監視
    this.todoList.subscribe(() => this.render());
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
  }

  handleAddTodo() {
    const success = this.todoList.addTodo(this.todoInput.value);
    if (success) {
      this.todoInput.value = '';
    }
  }

  // Todo要素の作成
  createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

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

    // 編集機能
    if (!todo.completed) {
      todoText.addEventListener('click', () => this.setupEditMode(li, todo));
    }

    // 削除ボタン
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '削除';
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
