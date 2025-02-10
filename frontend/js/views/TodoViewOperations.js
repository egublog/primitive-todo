export class TodoViewOperations {
  constructor(elements) {
    this.elements = elements;
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
}
