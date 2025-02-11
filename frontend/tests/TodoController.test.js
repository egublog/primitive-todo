import { TodoController } from '../js/controllers/TodoController.js';
import { 
    assert, 
    assertEquals, 
    assertDeepEquals, 
    createMock, 
    mockFetch, 
    displayTestResult,
    setupTestDOM,
    cleanupTestDOM
} from './testUtils.js';

// モックデータ
const mockTodos = [
    {
        id: '1',
        title: 'Test Todo 1',
        description: 'Test Description 1',
        priority: 'high',
        category: 'work',
        completed: false,
        dueDate: '2025-02-13T23:59:59.000Z'
    }
];

/**
 * TodoControllerのテスト
 */
// 各テストケース用の初期化関数
async function setupTest() {
    setupTestDOM();
    const originalFetch = window.fetch;
    window.fetch = async (url, config) => {
        return {
            ok: true,
            status: 200,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => []
        };
    };
    const controller = new TodoController();
    await new Promise(resolve => setTimeout(resolve, 500));
    return { controller, originalFetch };
}

export async function testTodoController() {
    const results = [];

    // テストケース1: 初期化テスト
    try {
        const { controller, originalFetch } = await setupTest();
        
        assert(controller.isLoading === false, "初期状態でisLoadingはfalseであるべき");
        assert(controller.operationStates instanceof Map, "operationStatesはMapであるべき");
        
        window.fetch = originalFetch;
        results.push(displayTestResult("初期化テスト", true));
    } catch (error) {
        results.push(displayTestResult("初期化テスト", false, error.message));
    }

    // テストケース2: 操作状態の設定テスト
    try {
        const { controller, originalFetch } = await setupTest();
        const operationId = "test-operation";
        controller.setOperationState(operationId, "pending");
        
        const state = controller.operationStates.get(operationId);
        assert(state.status === "pending", "操作状態が正しく設定されるべき");
        assert(state.error === null, "エラーはnullであるべき");
        
        results.push(displayTestResult("操作状態の設定テスト", true));
    } catch (error) {
        results.push(displayTestResult("操作状態の設定テスト", false, error.message));
    }

    // テストケース3: Todoの追加テスト
    try {
        const { controller, originalFetch } = await setupTest();
        
        // 追加用のfetchをモック化
        window.fetch = async (url, config) => {
            if (config && config.method === 'POST') {
                return {
                    ok: true,
                    status: 200,
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    json: async () => ({ id: '2', ...mockTodos[0] })
                };
            }
            return {
                ok: true,
                status: 200,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => []
            };
        };
        await controller.addTodo(
            "Test Todo",
            "high",
            "2025年02月13日",
            "work"
        );

        window.fetch = originalFetch;
        results.push(displayTestResult("Todo追加テスト", true));
    } catch (error) {
        results.push(displayTestResult("Todo追加テスト", false, error.message));
    }

    // テストケース4: エラー処理テスト
    try {
        const { controller, originalFetch } = await setupTest();
        let errorShown = false;
        let shownErrorMessage = "";

        controller.view.showError = (msg) => {
            errorShown = true;
            shownErrorMessage = msg;
        };
        
        window.fetch = async (url, config) => {
            if (config && config.method === 'POST') {
                const error = new Error("HTTP error! status: 500");
                error.status = 500;
                throw error;
            }
            return {
                ok: true,
                status: 200,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => []
            };
        };
        
        await controller.addTodo("Test Todo", "high", null, "work");
        
        assert(errorShown, "エラーが表示されるべき");
        assert(shownErrorMessage.includes("Todoの追加に失敗しました"), "適切なエラーメッセージが表示されるべき");
        assert(shownErrorMessage.includes("HTTP error! status: 500"), "エラーステータスが含まれるべき");
        
        window.fetch = originalFetch;
        results.push(displayTestResult("エラー処理テスト", true));
    } catch (error) {
        results.push(displayTestResult("エラー処理テスト", false, error.message));
    }

    // テストケース5: 日付フォーマット変換テスト
    try {
        const { controller, originalFetch } = await setupTest();
        let postData = null;

        window.fetch = async (url, config) => {
            if (config && config.method === 'POST') {
                postData = JSON.parse(config.body);
                return {
                    ok: true,
                    status: 200,
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    json: async () => ({ id: '3', ...postData })
                };
            }
            return {
                ok: true,
                status: 200,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => []
            };
        };

        await controller.addTodo(
            "Test Todo",
            "high",
            "2025年02月13日",
            "work"
        );

        assert(postData !== null, "POSTリクエストが送信されるべき");
        assert(
            postData.dueDate === "2025-02-13T14:59:59.000Z",
            `日付が正しくISO形式に変換されるべき。実際の値: ${postData.dueDate}`
        );
        assert(
            postData.title === "Test Todo" &&
            postData.priority === "high" &&
            postData.category === "work",
            "その他のフィールドが正しく設定されるべき"
        );

        window.fetch = originalFetch;
        results.push(displayTestResult("日付フォーマット変換テスト", true));
    } catch (error) {
        results.push(displayTestResult("日付フォーマット変換テスト", false, error.message));
    }

    // テスト後にDOMをクリーンアップ
    cleanupTestDOM();
    
    return results;
}
