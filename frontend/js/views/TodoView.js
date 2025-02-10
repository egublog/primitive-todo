import { TodoViewBase } from "./TodoViewBase.js";
import { TodoViewOperations } from "./TodoViewOperations.js";
import { TodoViewDOM } from "./TodoViewDOM.js";
import { TodoViewI18n } from "./TodoViewI18n.js";
import { TodoViewRendering } from "./TodoViewRendering.js";

export class TodoView extends TodoViewBase {
  constructor(controller) {
    super(controller);
    
    this.operations = new TodoViewOperations(this.elements);
    this.i18n = new TodoViewI18n();
    this.dom = new TodoViewDOM(this.elements, this.controller, this.isLoading);
    this.rendering = new TodoViewRendering(this.elements, this.dom);
  }

  updateOperationState(operationId, status, error = null) {
    this.operations.updateOperationState(operationId, status, error);
  }

  removeOperationState(operationId) {
    this.operations.removeOperationState(operationId);
  }

  render(todos) {
    this.rendering.render(todos);
  }

  translateValue(type, value) {
    return this.i18n.translateValue(type, value);
  }

  formatDueDate(dueDate) {
    return this.i18n.formatDueDate(dueDate);
  }
}
