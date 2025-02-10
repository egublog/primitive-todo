import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../utils/api.js";
import { TodoView } from "../views/TodoView.js";

export class TodoController {
  constructor() {
    this.view = new TodoView(this);
    this.isLoading = false;
    this.operationStates = new Map(); // 操作状態を管理
    this.initialize();
  }

  /**
   * 操作の状態を設定
   * @param {string} operationId - 操作のID
   * @param {string} status - 状態(pending/fulfilled/rejected)
   * @param {Error} error - エラー情報(オプション)
   */
  setOperationState(operationId, status, error = null) {
    this.operationStates.set(operationId, { status, error });
    this.view.updateOperationState(operationId, status, error);
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
      console.error("Todoリストの取得に失敗しました:", error);
      this.view.showError(`Todoリストの取得に失敗しました: ${error.message}`);
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

    const operationId = `add-${Date.now()}`;
    try {
      this.setLoading(true);
      this.setOperationState(operationId, "pending");
      console.log("Todo追加開始:", { text, priority, dueDate, category });
      // 日付文字列をISO形式に変換
      const formattedDueDate = dueDate
        ? new Date(dueDate + "T23:59:59").toISOString()
        : null;
      console.log("フォーマット済み日付:", formattedDueDate);
      const newTodo = await addTodo({
        title: text,
        description: text,
        priority,
        dueDate: formattedDueDate,
        category,
        completed: false,
      });
      // 全件再取得して画面を更新
      const todos = await fetchTodos();
      this.view.render(todos);
      this.setOperationState(operationId, "fulfilled");
    } catch (error) {
      console.error("Todoの追加に失敗しました:", error);
      let errorMessage = "Todoの追加に失敗しました";
      if (error.response) {
        try {
          const errorData = await error.response.json();
          errorMessage += `: ${errorData.message || error.message}`;
        } catch (e) {
          errorMessage += `: ${error.message}`;
        }
      } else {
        errorMessage += `: ${error.message}`;
      }
      this.view.showError(errorMessage);
      this.setOperationState(operationId, "rejected", error);
    } finally {
      this.setLoading(false);
      // 5秒後に操作状態をクリア
      setTimeout(() => {
        this.operationStates.delete(operationId);
        this.view.removeOperationState(operationId);
      }, 5000);
    }
  }

  /**
   * Todoを削除
   * @param {string} id
   */
  async deleteTodo(id) {
    if (this.isLoading) return;

    const operationId = `delete-${id}`;
    try {
      this.setLoading(true);
      this.setOperationState(operationId, "pending");
      await deleteTodo(id);
      // 全件再取得して画面を更新
      const todos = await fetchTodos();
      this.view.render(todos);
      this.setOperationState(operationId, "fulfilled");
    } catch (error) {
      console.error("Todoの削除に失敗しました:", error);
      this.view.showError(`Todoの削除に失敗しました: ${error.message}`);
      this.setOperationState(operationId, "rejected", error);
    } finally {
      this.setLoading(false);
      // 5秒後に操作状態をクリア
      setTimeout(() => {
        this.operationStates.delete(operationId);
        this.view.removeOperationState(operationId);
      }, 5000);
    }
  }

  /**
   * Todoの完了状態を切り替え
   * @param {string} id
   */
  async toggleTodo(id) {
    if (this.isLoading) return;

    const operationId = `toggle-${id}`;
    try {
      this.setLoading(true);
      this.setOperationState(operationId, "pending");
      // 現在のTodoリストを取得して、対象のTodoの状態を確認
      const todos = await fetchTodos();
      const todo = todos.find((t) => t.id === id);
      if (!todo) {
        throw new Error("Todo not found");
      }
      // 現在のTodoの全フィールドを保持しつつ、completed状態のみを反転
      await updateTodo(id, {
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        category: todo.category,
        dueDate: todo.dueDate,
        completed: !todo.completed
      });
      // 全件再取得して画面を更新
      const updatedTodos = await fetchTodos();
      this.view.render(updatedTodos);
      this.setOperationState(operationId, "fulfilled");
    } catch (error) {
      console.error("Todoの更新に失敗しました:", error);
      this.view.showError(`Todoの更新に失敗しました: ${error.message}`);
      this.setOperationState(operationId, "rejected", error);
    } finally {
      this.setLoading(false);
      // 5秒後に操作状態をクリア
      setTimeout(() => {
        this.operationStates.delete(operationId);
        this.view.removeOperationState(operationId);
      }, 5000);
    }
  }

  /**
   * Todoを更新
   * @param {string} id
   * @param {Object} updates
   */
  async updateTodo(id, updates) {
    if (this.isLoading) return;

    const operationId = `update-${id}`;
    try {
      this.setLoading(true);
      this.setOperationState(operationId, "pending");
      await updateTodo(id, updates);
      // 全件再取得して画面を更新
      const todos = await fetchTodos();
      this.view.render(todos);
      this.setOperationState(operationId, "fulfilled");
    } catch (error) {
      this.view.showError("Todoの更新に失敗しました");
      this.setOperationState(operationId, "rejected", error);
    } finally {
      this.setLoading(false);
      // 5秒後に操作状態をクリア
      setTimeout(() => {
        this.operationStates.delete(operationId);
        this.view.removeOperationState(operationId);
      }, 5000);
    }
  }
}
