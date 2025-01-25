import { fetchTodos } from '../utils/api.js';

export class TodoView {
  constructor(controller) {
    this.controller = controller;
    this.initializeElements();
    this.setupEventListeners();
    this.isLoading = false;
    this.init();
  }

  async init() {
    try {
      this.setLoading(true);
      const todos = await fetchTodos();
      this.render(todos);
    } catch (error) {
      this.showError('Todoリストの取得に失敗しました');
      console.error('Todoリスト取得エラー:', error);
    } finally {
      this.setLoading(false);
    }
  }

  initializeElements() {
    this.elements = {
      todoInput: document.getElementById('todoInput'),
      addButton: document.getElementById('addTodo'),
      todoList: document.getElementById('todoList'),
      loadingIndicator: document.getElementById('loadingIndicator'),
      errorContainer: document.getElementById('errorContainer')
    };
  }

  setupEventListeners() {
    this.elements.addButton.addEventListener('click', () => {
      const text = this.elements.todoInput.value.trim();
      if (text && !this.isLoading) {
        this.controller.addTodo(
          text,
          document.getElementById('prioritySelect').value,
          document.getElementById('dueDateInput').value || null,
          document.getElementById('categorySelect').value
        );
        this.elements.todoInput.value = '';
      }
    });

    this.elements.todoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !this.isLoading) {
        this.elements.addButton.click();
      }
    });
  }

  /**
   * Todoリストを描画
   * @param {Array} todos 
   */
  render(todos) {
    this.elements.todoList.innerHTML = '';
    
    todos.forEach(todo => {
      const todoItem = this.createTodoElement(todo);
      this.elements.todoList.appendChild(todoItem);
    });
  }

  /**
   * Todoアイテム要素を作成
   * @param {Object} todo 
   * @returns {HTMLElement}
   */
  createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', todo.id);

    // チェックボックス
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
      if (!this.isLoading) {
        this.controller.toggleTodo(todo.id);
      }
    });

    // テキスト
    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;

    // 削除ボタン
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = '×';
    deleteButton.addEventListener('click', () => {
      if (!this.isLoading) {
        this.controller.deleteTodo(todo.id);
      }
    });

    // メタ情報
    const metaContainer = document.createElement('div');
    metaContainer.className = 'todo-meta';
    metaContainer.innerHTML = `
      <span class="priority">優先度: ${todo.priority}</span>
      <span class="category">カテゴリ: ${todo.category}</span>
      ${todo.dueDate ? `<span class="due-date">期限: ${new Date(todo.dueDate).toLocaleDateString()}</span>` : ''}
    `;

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(metaContainer);
    li.appendChild(deleteButton);

    return li;
  }

  /**
   * ローディング状態を設定
   * @param {boolean} isLoading 
   */
  setLoading(isLoading) {
    this.isLoading = isLoading;
    this.elements.loadingIndicator.style.display = isLoading ? 'block' : 'none';
    this.elements.addButton.disabled = isLoading;
    this.elements.todoInput.disabled = isLoading;
  }

  /**
   * エラーメッセージを表示
   * @param {string} message 
   */
  showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    this.elements.errorContainer.appendChild(errorElement);
    setTimeout(() => {
      errorElement.remove();
    }, 5000);
  }
}
