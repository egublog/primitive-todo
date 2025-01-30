import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../utils/api.js';
import { TodoView } from '../views/TodoView.js';

export class TodoController {
  constructor() {
    this.view = new TodoView(this);
    this.isLoading = false;
    this.initialize();
  }

  /**
   * 初期化処理
   */
  async initialize() {
    try {
      this.setLoading(true);
      const todos = await fetchTodos();
      this.view.render(todos);
    } catch (error) {
      this.view.showError('Todoリストの取得に失敗しました');
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * ローディング状態の設定
   * @param {boolean} isLoading 
   */
  setLoading(isLoading) {
    this.isLoading = isLoading;
    this.view.setLoading(isLoading);
  }

  /**
   * Todoを追加
   * @param {string} text 
   * @param {string} priority 
   * @param {string|null} dueDate 
   * @param {string} category 
   */
  async addTodo(text, priority, dueDate, category) {
    if (this.isLoading) return;

    try {
      this.setLoading(true);
      await addTodo({
        title: text,
        description: text,
        priority,
        dueDate,
        category,
        completed: false
      });
      // 全件再取得して画面を更新
      const todos = await fetchTodos();
      this.view.render(todos);
    } catch (error) {
      this.view.showError('Todoの追加に失敗しました');
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Todoを削除
   * @param {string} id 
   */
  async deleteTodo(id) {
    if (this.isLoading) return;

    try {
      this.setLoading(true);
      await deleteTodo(id);
      // 全件再取得して画面を更新
      const todos = await fetchTodos();
      this.view.render(todos);
    } catch (error) {
      this.view.showError('Todoの削除に失敗しました');
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Todoの完了状態を切り替え
   * @param {string} id 
   */
  async toggleTodo(id) {
    if (this.isLoading) return;

    try {
      this.setLoading(true);
      // 現在のTodoリストを取得して、対象のTodoの状態を確認
      const todos = await fetchTodos();
      const todo = todos.find(t => t.id === id);
      if (!todo) {
        throw new Error('Todo not found');
      }
      // 現在の完了状態を反転
      await updateTodo(id, { completed: !todo.completed });
      // 全件再取得して画面を更新
      const updatedTodos = await fetchTodos();
      this.view.render(updatedTodos);
    } catch (error) {
      this.view.showError('Todoの更新に失敗しました');
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Todoを更新
   * @param {string} id 
   * @param {Object} updates 
   */
  async updateTodo(id, updates) {
    if (this.isLoading) return;

    try {
      this.setLoading(true);
      await updateTodo(id, updates);
      // 全件再取得して画面を更新
      const todos = await fetchTodos();
      this.view.render(todos);
    } catch (error) {
      this.view.showError('Todoの更新に失敗しました');
    } finally {
      this.setLoading(false);
    }
  }
}
