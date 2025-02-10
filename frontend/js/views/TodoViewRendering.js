export class TodoViewRendering {
  constructor(elements, todoViewDOM) {
    this.elements = elements;
    this.todoViewDOM = todoViewDOM;
  }

  render(todos) {
    const scrollPosition = window.scrollY;

    const updateTodoElement = (todo, existingItem) => {
      if (!existingItem) {
        const newItem = this.todoViewDOM.createTodoElement(todo);
        const container = todo.completed
          ? this.elements.completedTodoList
          : this.elements.incompleteTodoList;
        container.insertBefore(newItem, container.firstChild);
        return;
      }

      const isCurrentlyCompleted =
        existingItem.parentElement === this.elements.completedTodoList;
      if (isCurrentlyCompleted !== todo.completed) {
        this.handleCompletionStatusChange(existingItem, todo);
        return;
      }

      if (this.todoViewDOM.shouldUpdateItem(existingItem, todo)) {
        this.todoViewDOM.updateExistingItem(existingItem, todo);
      }
    };

    const existingItems = this.collectExistingItems();
    
    todos.forEach((todo) => {
      const existingItem = existingItems.get(todo.id.toString());
      updateTodoElement(todo, existingItem);
      existingItems.delete(todo.id.toString());
    });

    this.removeDeletedItems(existingItems);
    window.scrollTo(0, scrollPosition);
  }

  collectExistingItems() {
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
    return existingItems;
  }

  handleCompletionStatusChange(existingItem, todo) {
    const targetContainer = todo.completed
      ? this.elements.completedTodoList
      : this.elements.incompleteTodoList;

    existingItem.style.animation =
      "slideOut var(--slide-duration) cubic-bezier(0.4, 0, 0.2, 1)";
    existingItem.addEventListener(
      "animationend",
      () => {
        const newItem = this.todoViewDOM.createTodoElement(todo);
        targetContainer.insertBefore(newItem, targetContainer.firstChild);
        existingItem.remove();
      },
      { once: true }
    );
  }

  removeDeletedItems(existingItems) {
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
  }
}
