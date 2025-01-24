import { TodoItem } from './TodoItem.js';

export class TodoList {
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
  addTodo(text, priority, dueDate, category) {
    if (!text.trim()) return false;
    
    const todo = new TodoItem(text, priority, false, dueDate, category);
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
  getFilteredTodos(completed, category = 'all') {
    let filteredTodos = this.todos.filter(todo => todo.completed === completed);
    if (category !== 'all') {
      filteredTodos = filteredTodos.filter(todo => todo.category === category);
    }
    return filteredTodos;
  }
}
