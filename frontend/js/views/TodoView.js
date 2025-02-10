export class TodoView {
  constructor(controller) {
    this.controller = controller;
    this.initializeElements();
    this.setupEventListeners();
    this.isLoading = false;
  }

  initializeElements() {
    this.elements = {
      todoInput: document.getElementById("todoInput"),
      addButton: document.getElementById("addTodo"),
      incompleteTodoList: document.getElementById("incompleteTodoList"),
      completedTodoList: document.getElementById("completedTodoList"),
      loadingIndicator: document.getElementById("loadingIndicator"),
      errorContainer: document.getElementById("errorContainer"),
      operationContainer:
        document.getElementById("operationContainer") ||
        this.createOperationContainer(),
    };
  }

  createOperationContainer() {
    const container = document.createElement("div");
    container.id = "operationContainer";
    container.className = "operation-container";
    document.body.appendChild(container);
    return container;
  }

  updateOperationState(operationId, status, error = null) {
    let stateElement = document.getElementById(`operation-${operationId}`);

    if (!stateElement) {
      stateElement = document.createElement("div");
      stateElement.id = `operation-${operationId}`;
      stateElement.className = "operation-state";
      this.elements.operationContainer.appendChild(stateElement);
    }

    stateElement.className = `operation-state operation-${status}`;

    let message = "";
    switch (status) {
      case "pending":
        message = "処理中...";
        break;
      case "fulfilled":
        message = "完了しました";
        break;
      case "rejected":
        message = `エラー: ${error ? error.message : "不明なエラー"}`;
        break;
    }

    stateElement.textContent = message;
    stateElement.style.animation = "fadeIn 0.3s ease-in-out";
  }

  removeOperationState(operationId) {
    const stateElement = document.getElementById(`operation-${operationId}`);
    if (stateElement) {
      stateElement.style.animation = "fadeOut 0.3s ease-in-out";
      stateElement.addEventListener(
        "animationend",
        () => {
          stateElement.remove();
        },
        { once: true }
      );
    }
  }

  setupEventListeners() {
    const form = document.querySelector(".todo-input");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleAddTodo();
    });

    this.elements.addButton.addEventListener("click", (e) => {
      if (!this.elements.todoInput.form) {
        e.preventDefault();
        this.handleAddTodo();
      }
    });
  }

  handleAddTodo() {
    const text = this.elements.todoInput.value.trim();
    if (text && !this.isLoading) {
      this.controller.addTodo(
        text,
        document.getElementById("prioritySelect").value || "medium",
        document.getElementById("dueDateInput").value || null,
        document.getElementById("categorySelect").value || "none"
      );
      this.elements.todoInput.value = "";
    }
  }

  render(todos) {
    const scrollPosition = window.scrollY;

    const updateTodoElement = (todo, existingItem) => {
      if (!existingItem) {
        const newItem = this.createTodoElement(todo);
        const container = todo.completed
          ? this.elements.completedTodoList
          : this.elements.incompleteTodoList;
        container.insertBefore(newItem, container.firstChild);
        return;
      }

      const isCurrentlyCompleted =
        existingItem.parentElement === this.elements.completedTodoList;
      if (isCurrentlyCompleted !== todo.completed) {
        const targetContainer = todo.completed
          ? this.elements.completedTodoList
          : this.elements.incompleteTodoList;

        existingItem.style.animation =
          "slideOut var(--slide-duration) cubic-bezier(0.4, 0, 0.2, 1)";
        existingItem.addEventListener(
          "animationend",
          () => {
            const newItem = this.createTodoElement(todo);
            targetContainer.insertBefore(newItem, targetContainer.firstChild);
            existingItem.remove();
          },
          { once: true }
        );
        return;
      }

      if (this.shouldUpdateItem(existingItem, todo)) {
        this.updateExistingItem(existingItem, todo);
      }
    };

    const existingItems = new Map();
    this.elements.incompleteTodoList
      .querySelectorAll(".todo-item")
      .forEach((item) => {
        existingItems.set(item.getAttribute("data-id"), item);
      });
    this.elements.completedTodoList
      .querySelectorAll(".todo-item")
      .forEach((item) => {
        existingItems.set(item.getAttribute("data-id"), item);
      });

    todos.forEach((todo) => {
      const existingItem = existingItems.get(todo.id.toString());
      updateTodoElement(todo, existingItem);
      existingItems.delete(todo.id.toString());
    });

    existingItems.forEach((item) => {
      item.style.animation =
        "slideOut var(--slide-duration) cubic-bezier(0.4, 0, 0.2, 1)";
      item.addEventListener(
        "animationend",
        () => {
          item.remove();
        },
        { once: true }
      );
    });

    window.scrollTo(0, scrollPosition);
  }

  updateExistingItem(element, todo) {
    const textSpan = element.querySelector(".todo-text");
    if (textSpan.textContent !== todo.title) {
      textSpan.textContent = todo.title;
    }

    const currentPriority = element.getAttribute("data-priority");
    const newPriority = (todo.priority || "medium").toLowerCase();
    // 優先度の更新は常に行う
    element.setAttribute("data-priority", newPriority);
    const prioritySpan = element.querySelector(".priority-indicator");
    prioritySpan.className = `priority-indicator priority-${newPriority}`;
    const lang = document.documentElement.getAttribute("data-lang") || "ja";
    prioritySpan.textContent = window.translations[lang].priority[newPriority];

    const checkbox = element.querySelector(".todo-checkbox");
    if (checkbox.checked !== todo.completed) {
      checkbox.checked = todo.completed;
      element.classList.toggle("completed", todo.completed);
    }
  }

  shouldUpdateItem(element, todo) {
    const currentTitle = element.querySelector(".todo-text").textContent;
    const currentCompleted = element.classList.contains("completed");
    const currentPriority = element.getAttribute("data-priority");
    const todoPriority = (todo.priority || "medium").toLowerCase();

    return (
      currentTitle !== todo.title ||
      currentCompleted !== todo.completed ||
      currentPriority !== todoPriority
    );
  }

  createTodoElement(todo) {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed" : ""}`;
    li.setAttribute("data-id", todo.id);

    const priority = (todo.priority || "medium").toLowerCase();
    li.setAttribute("data-priority", priority);

    const firstRow = document.createElement("div");
    firstRow.className = "todo-first-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
      if (!this.isLoading) {
        this.controller.toggleTodo(todo.id);
      }
    });

    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";
    textSpan.textContent = todo.title;

    textSpan.addEventListener("click", () => {
      if (this.isLoading || todo.completed) return;

      const input = document.createElement("input");
      input.type = "text";
      input.className = "todo-edit-input";
      input.value = todo.title;

      textSpan.style.display = "none";
      firstRow.insertBefore(input, deleteButton);
      input.focus();

      const finishEdit = () => {
        const newText = input.value.trim();
        if (newText && newText !== todo.title) {
          this.controller.updateTodo(todo.id, { title: newText });
        }
        input.remove();
        textSpan.style.display = "";
      };

      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          finishEdit();
        }
      });

      input.addEventListener("blur", finishEdit);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    const lang = document.documentElement.getAttribute("data-lang") || "ja";
    deleteButton.textContent = window.translations[lang].deleteButton;
    deleteButton.setAttribute("data-i18n", "deleteButton");
    deleteButton.addEventListener("click", () => {
      if (!this.isLoading) {
        this.controller.deleteTodo(todo.id);
      }
    });

    firstRow.appendChild(checkbox);
    firstRow.appendChild(textSpan);
    firstRow.appendChild(deleteButton);

    const secondRow = document.createElement("div");
    secondRow.className = "todo-second-row";

    const metaContainer = document.createElement("div");
    metaContainer.className = "metadata-container";

    const prioritySpan = document.createElement("span");
    prioritySpan.className = `priority-indicator priority-${priority}`;
    prioritySpan.textContent = window.translations[lang].priority[priority];
    prioritySpan.setAttribute("data-i18n", `priority.${priority}`);
    metaContainer.appendChild(prioritySpan);

    const category = todo.category || "none";
    if (category && category !== "none" && category !== "なし") {
      const categorySpan = document.createElement("span");
      categorySpan.className = "category-tag";
      categorySpan.textContent = window.translations[lang].category[category];
      categorySpan.setAttribute("data-i18n", `category.${category}`);
      metaContainer.appendChild(categorySpan);
    }

    const dueDateSpan = document.createElement("span");
    dueDateSpan.className = "due-date";
    if (todo.dueDate) {
      const dueDate = new Date(todo.dueDate);
      const now = new Date();
      if (dueDate < now) {
        dueDateSpan.classList.add("expired");
      }
      dueDateSpan.textContent = this.formatDueDate(todo.dueDate);
    } else {
      dueDateSpan.textContent = window.translations[lang].noDueDate;
      dueDateSpan.setAttribute("data-i18n", "noDueDate");
    }
    metaContainer.appendChild(dueDateSpan);

    secondRow.appendChild(metaContainer);
    li.appendChild(firstRow);
    li.appendChild(secondRow);

    return li;
  }

  translateValue(type, value) {
    const lang = document.documentElement.getAttribute("data-lang") || "ja";
    const { translations } = window;

    if (!translations || !translations[lang]) return value;

    value = value || (type === "priority" ? "medium" : "none");

    if (type === "priority") {
      return translations[lang].priority[value.toLowerCase()] || value;
    } else if (type === "category") {
      return translations[lang].category[value] || value;
    }

    return value;
  }

  formatDueDate(dueDate) {
    const date = new Date(dueDate);
    const lang = document.documentElement.getAttribute("data-lang") || "ja";

    const options = {
      year: "numeric",
      month: lang === "ja" ? "long" : "short",
      day: "numeric",
    };

    return date.toLocaleDateString(lang === "ja" ? "ja-JP" : "en-US", options);
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
    this.elements.loadingIndicator.style.display = isLoading ? "block" : "none";
    this.elements.addButton.disabled = isLoading;
    this.elements.todoInput.disabled = isLoading;
  }

  showError(message) {
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;

    this.elements.errorContainer.appendChild(errorElement);
    setTimeout(() => {
      errorElement.remove();
    }, 5000);
  }
}
