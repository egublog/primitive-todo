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
    // スクロール位置を保存
    const scrollPosition = window.scrollY;

    const updateTodoElement = (todo, existingItem) => {
      if (!existingItem) {
        const newItem = this.createTodoElement(todo);
        const container = todo.completed ? 
          this.elements.completedTodoList : 
          this.elements.incompleteTodoList;
        container.insertBefore(newItem, container.firstChild);
        return;
      }

      // 完了状態が変更された場合
      const isCurrentlyCompleted = existingItem.parentElement === this.elements.completedTodoList;
      if (isCurrentlyCompleted !== todo.completed) {
        const targetContainer = todo.completed ? 
          this.elements.completedTodoList : 
          this.elements.incompleteTodoList;
        
        existingItem.style.animation = 'slideOut var(--slide-duration) cubic-bezier(0.4, 0, 0.2, 1)';
        existingItem.addEventListener('animationend', () => {
          const newItem = this.createTodoElement(todo);
          targetContainer.insertBefore(newItem, targetContainer.firstChild);
          existingItem.remove();
        }, { once: true });
        return;
      }

      // その他の更新が必要な場合
      if (this.shouldUpdateItem(existingItem, todo)) {
        this.updateExistingItem(existingItem, todo);
      }
    };

    // 既存のアイテムをMapに格納
    const existingItems = new Map();
    this.elements.incompleteTodoList.querySelectorAll('.todo-item').forEach(item => {
      existingItems.set(item.getAttribute('data-id'), item);
    });
    this.elements.completedTodoList.querySelectorAll('.todo-item').forEach(item => {
      existingItems.set(item.getAttribute('data-id'), item);
    });

    // 各Todoを更新
    todos.forEach(todo => {
      const existingItem = existingItems.get(todo.id.toString());
      updateTodoElement(todo, existingItem);
      existingItems.delete(todo.id.toString());
    });

    // 不要になったアイテムを削除
    existingItems.forEach(item => {
      item.style.animation = 'slideOut var(--slide-duration) cubic-bezier(0.4, 0, 0.2, 1)';
      item.addEventListener('animationend', () => {
        item.remove();
      }, { once: true });
    });

    // スクロール位置を復元
    window.scrollTo(0, scrollPosition);
  }

  /**
   * 既存のTodoアイテムを更新
   * @param {HTMLElement} element 
   * @param {Object} todo 
   */
  updateExistingItem(element, todo) {
    // テキストの更新
    const textSpan = element.querySelector('.todo-text');
    if (textSpan.textContent !== todo.title) {
      textSpan.textContent = todo.title;
    }

    // 優先度の更新
    const currentPriority = element.getAttribute('data-priority');
    const newPriority = todo.priority.toLowerCase();
    if (currentPriority !== newPriority) {
      element.setAttribute('data-priority', newPriority);
      const prioritySpan = element.querySelector('.priority-indicator');
      prioritySpan.className = `priority-indicator priority-${newPriority}`;
      const lang = document.documentElement.getAttribute('data-lang') || 'ja';
      prioritySpan.textContent = window.translations[lang].priority[newPriority];
    }

    // 完了状態の更新
    const checkbox = element.querySelector('.todo-checkbox');
    if (checkbox.checked !== todo.completed) {
      checkbox.checked = todo.completed;
      element.classList.toggle('completed', todo.completed);
    }
  }

  /**
   * Todoアイテムの更新が必要か判定
   * @param {HTMLElement} element 
   * @param {Object} todo 
   * @returns {boolean}
   */
  shouldUpdateItem(element, todo) {
    const currentTitle = element.querySelector('.todo-text').textContent;
    const currentCompleted = element.classList.contains('completed');
    const currentPriority = element.getAttribute('data-priority');
    
    return currentTitle !== todo.title ||
           currentCompleted !== todo.completed ||
           currentPriority !== todo.priority.toLowerCase();
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

    // テキストクリックで編集モードを有効化
    textSpan.addEventListener('click', () => {
      if (this.isLoading || todo.completed) return;
      
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'todo-edit-input';
      input.value = todo.title;
      
      // 現在のtextSpanを一時的に非表示
      textSpan.style.display = 'none';
      firstRow.insertBefore(input, deleteButton);
      input.focus();
      
      // 編集完了時の処理
      const finishEdit = () => {
        const newText = input.value.trim();
        if (newText && newText !== todo.title) {
          this.controller.updateTodo(todo.id, { title: newText });
        }
        input.remove();
        textSpan.style.display = '';
      };
      
      // Enterキーで編集完了
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          finishEdit();
        }
      });
      
      // フォーカスを失ったときも編集完了
      input.addEventListener('blur', finishEdit);
    });

    // 削除ボタン
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    const lang = document.documentElement.getAttribute('data-lang') || 'ja';
    deleteButton.textContent = window.translations[lang].deleteButton;
    deleteButton.setAttribute('data-i18n', 'deleteButton');
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
    prioritySpan.textContent = window.translations[lang].priority[todo.priority.toLowerCase()];
    prioritySpan.setAttribute('data-i18n', `priority.${todo.priority.toLowerCase()}`);
    metaContainer.appendChild(prioritySpan);

    // カテゴリー
    if (todo.category && todo.category !== 'none' && todo.category !== 'なし') {
      const categorySpan = document.createElement('span');
      categorySpan.className = 'category-tag';
      categorySpan.textContent = window.translations[lang].category[todo.category];
      categorySpan.setAttribute('data-i18n', `category.${todo.category}`);
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
      dueDateSpan.textContent = window.translations[lang].noDueDate;
      dueDateSpan.setAttribute('data-i18n', 'noDueDate');
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
