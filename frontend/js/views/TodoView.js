export class TodoView {
  constructor(controller) {
    this.controller = controller;
    this.initializeElements();
    this.setupEventListeners();
    this.isLoading = false;
  }

  initializeElements() {
    this.elements = {
      todoInput: document.getElementById('todoInput'),
      addButton: document.getElementById('addTodo'),
      incompleteTodoList: document.getElementById('incompleteTodoList'),
      completedTodoList: document.getElementById('completedTodoList'),
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
    this.elements.incompleteTodoList.innerHTML = '';
    this.elements.completedTodoList.innerHTML = '';
    
    todos.forEach(todo => {
      const todoItem = this.createTodoElement(todo);
      if (todo.completed) {
        this.elements.completedTodoList.appendChild(todoItem);
      } else {
        this.elements.incompleteTodoList.appendChild(todoItem);
      }
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
    li.setAttribute('data-priority', todo.priority.toLowerCase());

    // 1段目
    const firstRow = document.createElement('div');
    firstRow.className = 'todo-first-row';

    // チェックボックス
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
      if (!this.isLoading) {
        this.controller.toggleTodo(todo.id);
      }
    });

    // テキスト
    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.title;

    // 削除ボタン
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', () => {
      if (!this.isLoading) {
        this.controller.deleteTodo(todo.id);
      }
    });

    firstRow.appendChild(checkbox);
    firstRow.appendChild(textSpan);
    firstRow.appendChild(deleteButton);

    // 2段目
    const secondRow = document.createElement('div');
    secondRow.className = 'todo-second-row';

    // メタデータコンテナ
    const metaContainer = document.createElement('div');
    metaContainer.className = 'metadata-container';

    // 優先度
    const prioritySpan = document.createElement('span');
    prioritySpan.className = `priority-indicator priority-${todo.priority.toLowerCase()}`;
    prioritySpan.textContent = this.translateValue('priority', todo.priority);
    metaContainer.appendChild(prioritySpan);

    // カテゴリー
    if (todo.category && todo.category !== 'なし') {
      const categorySpan = document.createElement('span');
      categorySpan.className = 'category-tag';
      categorySpan.textContent = this.translateValue('category', todo.category);
      metaContainer.appendChild(categorySpan);
    }

    // 期限
    const dueDateSpan = document.createElement('span');
    dueDateSpan.className = 'due-date';
    if (todo.dueDate) {
      const dueDate = new Date(todo.dueDate);
      const now = new Date();
      if (dueDate < now) {
        dueDateSpan.classList.add('expired');
      }
      dueDateSpan.textContent = this.formatDueDate(todo.dueDate);
    } else {
      dueDateSpan.textContent = '期限なし';
    }
    metaContainer.appendChild(dueDateSpan);

    secondRow.appendChild(metaContainer);

    li.appendChild(firstRow);
    li.appendChild(secondRow);

    return li;
  }

  /**
   * 値の翻訳
   * @param {string} type - 翻訳タイプ ('priority' または 'category')
   * @param {string} value - 翻訳する値
   * @returns {string} 翻訳された値
   */
  translateValue(type, value) {
    const lang = document.documentElement.getAttribute('data-lang') || 'ja';
    const { translations } = window;
    
    if (!translations || !translations[lang]) return value;

    if (type === 'priority') {
      return translations[lang].priority[value.toLowerCase()] || value;
    } else if (type === 'category') {
      return translations[lang].category[value] || value;
    }
    
    return value;
  }

  /**
   * 期限日のフォーマット
   * @param {string} dueDate - ISO形式の日付文字列
   * @returns {string} フォーマットされた日付文字列
   */
  formatDueDate(dueDate) {
    const date = new Date(dueDate);
    const lang = document.documentElement.getAttribute('data-lang') || 'ja';
    
    const options = {
      year: 'numeric',
      month: lang === 'ja' ? 'long' : 'short',
      day: 'numeric'
    };
    
    return date.toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US', options);
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
