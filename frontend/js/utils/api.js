/**
 * Todoリストを取得
 * @returns {Promise<Array>}
 */
export async function fetchTodos() {
  try {
    const response = await fetch("http://localhost:8080/api/todos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // レスポンスのバリデーション
    if (!Array.isArray(data)) {
      throw new Error("Invalid response format");
    }

    return data.map((todo) => ({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      category: todo.category,
      dueDate: todo.dueDate,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    }));
  } catch (error) {
    console.error("Todoリスト取得エラー:", error);
    throw error;
  }
}

/**
 * Todoアイテムを追加
 * @param {Object} todo
 * @returns {Promise<Object>}
 */
export async function addTodo(todo) {
  console.log("Adding todo:", todo);
  try {
    const response = await fetch("http://localhost:8080/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(todo),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Todo added successfully:", data);
    return data;
  } catch (error) {
    console.error("Todo追加エラー:", error);
    if (error.response) {
      console.error("サーバーレスポンス:", await error.response.text());
    }
    throw error;
  }
}

/**
 * Todoアイテムを更新
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export async function updateTodo(id, updates) {
  try {
    const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Todo更新エラー:", error);
    throw error;
  }
}

/**
 * Todoアイテムを削除
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteTodo(id) {
  try {
    const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Todo削除エラー:", error);
    throw error;
  }
}
