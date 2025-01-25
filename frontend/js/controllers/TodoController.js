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
      const newTodo = await addTodo({
        text,
        priority,
        dueDate,
        category,
        completed: false
      });
      this.view.render([newTodo]);
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
      await updateTodo(id, { completed: true });
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
    } catch (error) {
      this.view.showError('Todoの更新に失敗しました');
    } finally {
      this.setLoading(false);
    }
  }
}
