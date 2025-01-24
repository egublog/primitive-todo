// DOM要素の取得
const todoInput = document.getElementById('todoInput');
const addTodoButton = document.getElementById('addTodo');
const incompleteTodoList = document.getElementById('incompleteTodoList');
const completedTodoList = document.getElementById('completedTodoList');

// LocalStorageのキー
const STORAGE_KEY = 'todos';

// Todoリストの状態
let todos = [];

// LocalStorageからデータを読み込む
function loadTodos() {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
        renderTodos();
    }
}

// LocalStorageにデータを保存
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Todoリストを描画
function renderTodos() {
    incompleteTodoList.innerHTML = '';
    completedTodoList.innerHTML = '';
    
    todos.forEach((todo, index) => {
        const targetList = todo.completed ? completedTodoList : incompleteTodoList;
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        // チェックボックスの作成
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.onclick = () => toggleTodo(index);

        // TODOテキスト用のspan要素
        const todoText = document.createElement('span');
        todoText.className = 'todo-text';
        todoText.textContent = todo.text;
        
        // クリックで編集モードに切り替え
        todoText.onclick = function() {
            if (todo.completed) return; // 完了済みの場合は編集不可
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = todoText.textContent;
            input.className = 'edit-input';
            
            // Enterキーで編集完了
            input.onkeydown = function(e) {
                if (e.key === 'Enter') {
                    const newText = input.value.trim();
                    if (newText) {
                        todos[index].text = newText;
                        saveTodos();
                        renderTodos();
                    }
                }
            };
            
            // フォーカスを失ったときも編集完了
            input.onblur = function() {
                const newText = input.value.trim();
                if (newText) {
                    todos[index].text = newText;
                    saveTodos();
                    renderTodos();
                }
            };
            
            li.replaceChild(input, todoText);
            input.focus();
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '削除';
        deleteBtn.onclick = () => deleteTodo(index);

        li.appendChild(checkbox);
        li.appendChild(todoText);
        li.appendChild(deleteBtn);
        
        // アニメーション付きで追加
        li.style.opacity = '0';
        li.style.transform = 'translateY(20px)';
        targetList.appendChild(li);
        
        // DOM追加後にアニメーション開始
        requestAnimationFrame(() => {
            li.style.transition = 'all 0.3s ease';
            li.style.opacity = '1';
            li.style.transform = 'translateY(0)';
        });
    });
}

// 新しいTodoを追加
function addTodo() {
    const text = todoInput.value.trim();
    if (text) {
        todos.push({
            text,
            completed: false
        });
        todoInput.value = '';
        saveTodos();
        renderTodos();
    }
}

// Todoの完了状態を切り替え
function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

// Todoを削除
function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

// イベントリスナーの設定
addTodoButton.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// 初期化
loadTodos();
