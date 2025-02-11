import { testTodoController } from "./TodoController.test.js";
import { displayTestSummary } from "./testUtils.js";

/**
 * すべてのテストを実行
 */
async function runAllTests() {
  console.log("テストを開始します...");

  // TodoControllerのテストを実行
  const todoControllerResults = await testTodoController();

  // テスト結果のサマリーを表示
  displayTestSummary(todoControllerResults);

  console.log("すべてのテストが完了しました。");
}

// DOMContentLoadedイベントでテストを実行
document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.createElement("button");
  startButton.textContent = "テストを実行";
  startButton.style.margin = "10px";
  startButton.style.padding = "5px 10px";
  startButton.style.fontSize = "14px";
  startButton.onclick = runAllTests;

  document.body.insertBefore(
    startButton,
    document.getElementById("test-summary")
  );
});
