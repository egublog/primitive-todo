import { TodoItem } from './TodoItem.js';
import { API } from '../utils/api.js';

/**
 * Todoリストを管理するクラス
 */
export class TodoList {
  /** @type {string[]} */
  static SORT_FIELDS = ['createdAt', 'updatedAt', 'dueDate', 'priority'];

  constructor() {
    /** @type {TodoItem[]} */
    this.todos = [];
    /** @type {Set<Function>} */
    this.listeners = new Set();
    /** @type {Map<string, Function>} */
    this.errorHandlers = new Map();
  }

  /**
   * イベントリスナーを登録
   * @param {Function} listener
   * @returns {Function} リスナー削除用の関数
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * エラーハンドラーを登録
   * @param {string} type エラーの種類
   * @param {Function} handler エラーハンドラー
   */
  onError(type, handler) {
    this.errorHandlers.set(type, handler);
  }

  /**
   * エラーを処理
   * @private
   * @param {string} type エラーの種類
   * @param {Error} error エラーオブジェクト
   */
  handleError(type, error) {
    const handler = this.errorHandlers.get(type);
    if (handler) {
      handler(error);
    } else {
      console.error(`[${type}]`, error);
    }
  }

  /**
   * 変更を通知
   * @private
   */
  notify() {
    this.listeners.forEach(listener => listener(this.todos));
  }

  /**
   * APIからデータを読み込み
   * @throws {Error} データの読み込みに失敗した場合
   */
  async load() {
    try {
      const data = await API.get();
      this.todos = data.map(item => {
        const todo = new TodoItem(
          item.title,
          item.description,
          item.priority,
          item.completed,
          item.dueDate,
          item.category
        );
        todo.id = item.id;
        todo.createdAt = item.createdAt;
        todo.updatedAt = item.updatedAt;
        return todo;
      });
      this.notify();
    } catch (error) {
      this.handleError('load', error);
      throw new Error('データの読み込みに失敗しました');
    }
  }

  /**
   * Todoを追加
   * @param {string} text テキスト
   * @param {string} priority 優先度
   * @param {string|null} dueDate 期限日
   * @param {string} category カテゴリー
   * @returns {Promise<TodoItem>} 作成されたTodoアイテム
   * @throws {Error} バリデーションエラー
   */
  async addTodo(title, description, priority, dueDate, category) {
    try {
      const todo = new TodoItem(title, description, priority, false, dueDate, category);
      const createdTodo = await API.post('', todo.toJSON());
      this.todos.push(new TodoItem(
        createdTodo.text,
        createdTodo.priority,
        createdTodo.completed,
        createdTodo.dueDate,
        createdTodo.category,
        createdTodo.id,
        createdTodo.createdAt,
        createdTodo.updatedAt
      ));
      this.notify();
      return createdTodo;
    } catch (error) {
      this.handleError('add', error);
      throw error;
    }
  }

  /**
   * Todoを削除
   * @param {string} id TodoのID
   * @returns {Promise<boolean>} 削除が成功したかどうか
   */
  async deleteTodo(id) {
    try {
      await API.delete(`/${id}`);
      const index = this.todos.findIndex(todo => todo.id === id);
      if (index !== -1) {
        this.todos.splice(index, 1);
        this.notify();
        return true;
      }
      return false;
    } catch (error) {
      this.handleError('delete', error);
      throw new Error('Todoの削除に失敗しました');
    }
  }

  /**
   * 複数のTodoを一括削除
   * @param {string[]} ids 削除するTodoのID配列
   * @returns {Promise<number>} 削除された件数
   */
  async deleteTodos(ids) {
    try {
      await Promise.all(ids.map(id => API.delete(`/${id}`)));
      const initialLength = this.todos.length;
      this.todos = this.todos.filter(todo => !ids.includes(todo.id));
      const deletedCount = initialLength - this.todos.length;
      if (deletedCount > 0) {
        this.notify();
      }
      return deletedCount;
    } catch (error) {
      this.handleError('delete', error);
      throw new Error('Todoの一括削除に失敗しました');
    }
  }

  /**
   * Todoの完了状態を切り替え
   * @param {string} id TodoのID
   * @returns {Promise<boolean>} 更新が成功したかどうか
   */
  async toggleTodo(id) {
    try {
      const todo = this.todos.find(todo => todo.id === id);
      if (todo) {
        const updatedTodo = await API.put(`/${id}`, {
          completed: !todo.completed
        });
        todo.update(updatedTodo);
        this.notify();
        return true;
      }
      return false;
    } catch (error) {
      this.handleError('toggle', error);
      throw new Error('Todoの状態更新に失敗しました');
    }
  }

  /**
   * Todoを更新
   * @param {string} id TodoのID
   * @param {Partial<TodoItem>} updates 更新内容
   * @returns {Promise<boolean>} 更新が成功したかどうか
   * @throws {Error} バリデーションエラー
   */
  async updateTodo(id, updates) {
    try {
      const todo = this.todos.find(todo => todo.id === id);
      if (todo) {
        const updatedTodo = await API.put(`/${id}`, updates);
        todo.update(updatedTodo);
        this.notify();
        return true;
      }
      return false;
    } catch (error) {
      this.handleError('update', error);
      throw error;
    }
  }

  /**
   * フィルター済みのTodoリストを取得
   * @param {Object} filters フィルター条件
   * @param {boolean} [filters.completed] 完了状態
   * @param {string} [filters.category] カテゴリー
   * @param {string} [filters.priority] 優先度
   * @param {boolean} [filters.expired] 期限切れ
   * @returns {TodoItem[]} フィルター済みのTodoリスト
   */
  getFilteredTodos(filters = {}) {
    return this.todos.filter(todo => {
      if (filters.completed !== undefined && todo.completed !== filters.completed) {
        return false;
      }
      if (filters.category && filters.category !== 'all' && todo.category !== filters.category) {
        return false;
      }
      if (filters.priority && todo.priority !== filters.priority) {
        return false;
      }
      if (filters.expired && !todo.isExpired()) {
        return false;
      }
      return true;
    });
  }

  /**
   * Todoリストをソート
   * @param {string} field ソートフィールド
   * @param {boolean} [ascending=true] 昇順かどうか
   * @returns {TodoItem[]} ソート済みのTodoリスト
   */
  getSortedTodos(field, ascending = true) {
    if (!TodoList.SORT_FIELDS.includes(field)) {
      throw new Error(`無効なソートフィールド: ${field}`);
    }

    return [...this.todos].sort((a, b) => {
      let comparison = 0;
      
      switch (field) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        default:
          comparison = a[field] < b[field] ? -1 : 1;
      }

      return ascending ? comparison : -comparison;
    });
  }

  /**
   * 統計情報を取得
   * @returns {Object} 統計情報
   */
  getStats() {
    const total = this.todos.length;
    const completed = this.todos.filter(todo => todo.completed).length;
    const expired = this.todos.filter(todo => todo.isExpired()).length;
    
    const byPriority = TodoItem.VALID_PRIORITIES.reduce((acc, priority) => {
      acc[priority] = this.todos.filter(todo => todo.priority === priority).length;
      return acc;
    }, {});

    const byCategory = TodoItem.VALID_CATEGORIES.reduce((acc, category) => {
      acc[category] = this.todos.filter(todo => todo.category === category).length;
      return acc;
    }, {});

    return {
      total,
      completed,
      active: total - completed,
      expired,
      byPriority,
      byCategory
    };
  }
}
