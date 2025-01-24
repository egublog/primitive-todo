export class TodoItem {
  constructor(text, priority = 'medium', completed = false, dueDate = null, category = 'none') {
    this.text = text;
    this.priority = priority;
    this.completed = completed;
    this.dueDate = dueDate;
    this.category = category;
    this.id = Date.now().toString(); // ユニークID
  }

  isExpired() {
    if (!this.dueDate || this.completed) return false;
    return new Date(this.dueDate) < new Date();
  }
}
