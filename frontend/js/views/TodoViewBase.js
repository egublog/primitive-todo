export class TodoViewBase {
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
