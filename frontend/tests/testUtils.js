/**
 * テスト用のDOM要素をセットアップ
 */
export function setupTestDOM() {
    // フォームとコンテナの作成
    const form = document.createElement('form');
    form.className = 'todo-input';
    document.body.appendChild(form);

    // 入力要素の作成（非表示）
    const todoInput = document.createElement('input');
    todoInput.id = 'todoInput';
    todoInput.style.display = 'none';
    form.appendChild(todoInput);

    const prioritySelect = document.createElement('select');
    prioritySelect.id = 'prioritySelect';
    prioritySelect.style.display = 'none';
    form.appendChild(prioritySelect);

    const dueDateInput = document.createElement('input');
    dueDateInput.id = 'dueDateInput';
    dueDateInput.style.display = 'none';
    form.appendChild(dueDateInput);

    const categorySelect = document.createElement('select');
    categorySelect.id = 'categorySelect';
    categorySelect.style.display = 'none';
    form.appendChild(categorySelect);

    // ボタンの作成
    const addButton = document.createElement('button');
    addButton.id = 'addTodo';
    addButton.style.display = 'none';
    form.appendChild(addButton);

    // リストコンテナの作成
    const incompleteTodoList = document.createElement('div');
    incompleteTodoList.id = 'incompleteTodoList';
    document.body.appendChild(incompleteTodoList);

    const completedTodoList = document.createElement('div');
    completedTodoList.id = 'completedTodoList';
    document.body.appendChild(completedTodoList);

    // その他の要素
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loadingIndicator';
    document.body.appendChild(loadingIndicator);

    const errorContainer = document.createElement('div');
    errorContainer.id = 'errorContainer';
    document.body.appendChild(errorContainer);

    const operationContainer = document.createElement('div');
    operationContainer.id = 'operationContainer';
    document.body.appendChild(operationContainer);
}

/**
 * テスト用のDOM要素をクリーンアップ
 */
export function cleanupTestDOM() {
    // テスト用に追加したすべての要素を削除
    const elements = [
        'todoInput',
        'addTodo',
        'incompleteTodoList',
        'completedTodoList',
        'loadingIndicator',
        'errorContainer',
        'operationContainer',
        'prioritySelect',
        'dueDateInput',
        'categorySelect'
    ];

    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    });

    // フォームの削除
    const form = document.querySelector('.todo-input');
    if (form) {
        form.remove();
    }
}

/**
 * アサーション関数
 */
export function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

export function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected} but got ${actual}`);
    }
}

export function assertDeepEquals(actual, expected, message) {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr !== expectedStr) {
        throw new Error(message || `Expected ${expectedStr} but got ${actualStr}`);
    }
}

/**
 * モック関数を作成
 */
export function createMock(returnValue) {
    const mock = (...args) => {
        mock.calls.push(args);
        return typeof returnValue === 'function' ? returnValue(...args) : returnValue;
    };
    mock.calls = [];
    mock.clear = () => {
        mock.calls = [];
    };
    return mock;
}

/**
 * Fetch APIのモック
 */
export function mockFetch(responseData, options = {}) {
    const {
        status = 200,
        statusText = 'OK',
        headers = { 'Content-Type': 'application/json' }
    } = options;

    return async (url, config) => {
        const response = {
            ok: status >= 200 && status < 300,
            status,
            statusText,
            headers: new Headers(headers),
            json: async () => responseData,
            text: async () => JSON.stringify(responseData)
        };

        return response;
    };
}

/**
 * テスト結果を表示
 */
export function displayTestResult(testName, passed, error = null) {
    const container = document.getElementById('test-results');
    const div = document.createElement('div');
    div.className = passed ? 'test-passed' : 'test-failed';
    
    let content = `${testName}: ${passed ? 'PASSED' : 'FAILED'}`;
    if (!passed && error) {
        content += `<div class="error-details">${error}</div>`;
    }
    
    div.innerHTML = content;
    container.appendChild(div);
    
    return { name: testName, passed, error };
}

/**
 * テストサマリーを表示
 */
export function displayTestSummary(results) {
    const container = document.getElementById('test-summary');
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;
    
    container.innerHTML = `
        実行したテスト: ${total}
        <br>
        成功: ${passed}
        <br>
        失敗: ${failed}
    `;
    
    container.style.backgroundColor = failed === 0 ? '#d4edda' : '#f8d7da';
    container.style.color = failed === 0 ? '#155724' : '#721c24';
    container.style.border = `1px solid ${failed === 0 ? '#c3e6cb' : '#f5c6cb'}`;
}
