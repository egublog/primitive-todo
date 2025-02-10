export class TodoViewDOM {
  constructor(elements, controller, isLoading) {
    this.elements = elements;
    this.controller = controller;
    this.isLoading = isLoading;
  }

  createTodoElement(todo) {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed" : ""}`;
    li.setAttribute("data-id", todo.id);

    const priority = (todo.priority || "medium").toLowerCase();
    li.setAttribute("data-priority", priority);

    const firstRow = this.createFirstRow(todo);
    const secondRow = this.createSecondRow(todo);

    li.appendChild(firstRow);
    li.appendChild(secondRow);

    return li;
  }

  createFirstRow(todo) {
    const firstRow = document.createElement("div");
    firstRow.className = "todo-first-row";

    const checkbox = this.createCheckbox(todo);
    const textSpan = this.createTextSpan(todo);
    const deleteButton = this.createDeleteButton();

    firstRow.appendChild(checkbox);
    firstRow.appendChild(textSpan);
    firstRow.appendChild(deleteButton);

    return firstRow;
  }

  createCheckbox(todo) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
      if (!this.isLoading) {
        this.controller.toggleTodo(todo.id);
      }
    });
    return checkbox;
  }

  createTextSpan(todo) {
    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";
    textSpan.textContent = todo.title;

    if (!todo.completed) {
      this.setupTextSpanEditability(textSpan, todo);
    }

    return textSpan;
  }

  setupTextSpanEditability(textSpan, todo) {
    textSpan.addEventListener("click", () => {
      if (this.isLoading) return;

      const input = document.createElement("input");
      input.type = "text";
      input.className = "todo-edit-input";
      input.value = todo.title;

      textSpan.style.display = "none";
      const parentElement = textSpan.parentElement;
      const deleteButton = parentElement.querySelector(".delete-btn");
      parentElement.insertBefore(input, deleteButton);
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
  }

  createDeleteButton() {
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    const lang = document.documentElement.getAttribute("data-lang") || "ja";
    deleteButton.textContent = window.translations[lang].deleteButton;
    deleteButton.setAttribute("data-i18n", "deleteButton");
    return deleteButton;
  }

  createSecondRow(todo) {
    const secondRow = document.createElement("div");
    secondRow.className = "todo-second-row";

    const metaContainer = document.createElement("div");
    metaContainer.className = "metadata-container";

    const prioritySpan = this.createPrioritySpan(todo);
    metaContainer.appendChild(prioritySpan);

    if (this.shouldShowCategory(todo)) {
      const categorySpan = this.createCategorySpan(todo);
      metaContainer.appendChild(categorySpan);
    }

    const dueDateSpan = this.createDueDateSpan(todo);
    metaContainer.appendChild(dueDateSpan);

    secondRow.appendChild(metaContainer);
    return secondRow;
  }

  createPrioritySpan(todo) {
    const priority = (todo.priority || "medium").toLowerCase();
    const lang = document.documentElement.getAttribute("data-lang") || "ja";
    
    const prioritySpan = document.createElement("span");
    prioritySpan.className = `priority-indicator priority-${priority}`;
    prioritySpan.textContent = window.translations[lang].priority[priority];
    prioritySpan.setAttribute("data-i18n", `priority.${priority}`);
    
    return prioritySpan;
  }

  shouldShowCategory(todo) {
    const category = todo.category || "none";
    return category && category !== "none" && category !== "なし";
  }

  createCategorySpan(todo) {
    const lang = document.documentElement.getAttribute("data-lang") || "ja";
    const category = todo.category || "none";
    
    const categorySpan = document.createElement("span");
    categorySpan.className = "category-tag";
    categorySpan.textContent = window.translations[lang].category[category];
    categorySpan.setAttribute("data-i18n", `category.${category}`);
    
    return categorySpan;
  }

  createDueDateSpan(todo) {
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
      const lang = document.documentElement.getAttribute("data-lang") || "ja";
      dueDateSpan.textContent = window.translations[lang].noDueDate;
      dueDateSpan.setAttribute("data-i18n", "noDueDate");
    }
    
    return dueDateSpan;
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

  updateExistingItem(element, todo) {
    const textSpan = element.querySelector(".todo-text");
    if (textSpan.textContent !== todo.title) {
      textSpan.textContent = todo.title;
    }

    const currentPriority = element.getAttribute("data-priority");
    const newPriority = (todo.priority || "medium").toLowerCase();
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
}
