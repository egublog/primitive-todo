/**
 * アプリケーションの翻訳データ
 */
export const translations = {
  ja: {
    // 基本UI要素
    title: 'プリミティブTodo',
    inputPlaceholder: '新しいタスクを入力',
    addButton: '追加',
    incomplete: '未完了',
    completed: '完了',
    deleteButton: '削除',
    editButton: '編集',
    saveButton: '保存',
    cancelButton: 'キャンセル',

    // 日付関連
    noDueDate: '期限なし',
    dueDate: '期限：',
    expired: '期限切れ',
    today: '今日',
    tomorrow: '明日',
    datePlaceholder: '期限を選択',
    dateFormat: 'YYYY年MM月DD日',
    remainingDays: {
      expired: '期限切れ',
      today: '今日まで',
      tomorrow: '明日まで',
      future: 'あと{days}日',
    },

    // 優先度
    priority: {
      high: '高',
      medium: '中',
      low: '低',
      label: '優先度：'
    },

    // カテゴリ
    category: {
      all: 'すべて',
      none: 'カテゴリなし',
      work: '仕事',
      personal: '個人',
      shopping: '買い物',
      study: '学習',
      label: 'カテゴリー：'
    },

    // フィルターとソート
    filter: {
      label: '表示するカテゴリー',
      all: 'すべて表示',
      active: '未完了のみ',
      completed: '完了済みのみ'
    },
    sort: {
      label: '並び替え',
      priority: '優先度順',
      dueDate: '期限日順',
      created: '作成日順',
      updated: '更新日順'
    },

    // アクセシビリティ
    aria: {
      addTask: '新しいタスクを追加',
      editTask: '{task}を編集',
      deleteTask: '{task}を削除',
      completeTask: '{task}を完了としてマーク',
      uncompleteTask: '{task}を未完了としてマーク',
      taskPriority: '優先度{priority}',
      taskCategory: 'カテゴリー{category}',
      taskDueDate: '期限{date}',
      taskExpired: '期限切れ',
      themeToggle: '{theme}モードに切り替え',
      languageToggle: '{language}に切り替え',
      filterCategory: 'カテゴリーで絞り込み',
      sortTasks: 'タスクの並び替え'
    },

    // ステータスメッセージ
    statusMessage: '未完了タスク{incomplete}件、完了済みタスク{completed}件',
    emptyState: {
      noTasks: 'タスクがありません',
      noResults: '該当するタスクがありません',
      addFirst: '最初のタスクを追加しましょう'
    },

    // エラーメッセージ
    errors: {
      addFailed: 'タスクの追加に失敗しました',
      updateFailed: 'タスクの更新に失敗しました',
      deleteFailed: 'タスクの削除に失敗しました',
      loadFailed: 'データの読み込みに失敗しました',
      saveFailed: 'データの保存に失敗しました',
      invalidInput: '入力内容が無効です',
      emptyText: 'テキストを入力してください',
      tooLong: 'テキストが長すぎます（最大200文字）',
      invalidDate: '無効な日付です',
      networkError: 'ネットワークエラーが発生しました'
    },

    // 操作ガイド
    help: {
      addTask: 'テキストを入力して「追加」をクリックまたはEnterキーを押してタスクを追加',
      editTask: 'タスクをクリックして編集',
      completeTask: 'チェックボックスをクリックしてタスクを完了',
      deleteTask: '削除ボタンをクリックしてタスクを削除',
      filterTasks: 'カテゴリーを選択してタスクを絞り込み',
      keyboard: {
        add: 'Enter: タスクを追加',
        edit: 'クリック: タスクを編集',
        save: 'Enter: 編集を保存',
        cancel: 'Esc: 編集をキャンセル',
        delete: 'Delete: タスクを削除'
      }
    }
  },
  en: {
    // Basic UI elements
    title: 'Primitive Todo',
    inputPlaceholder: 'Enter new task',
    addButton: 'Add',
    incomplete: 'Incomplete',
    completed: 'Completed',
    deleteButton: 'Delete',
    editButton: 'Edit',
    saveButton: 'Save',
    cancelButton: 'Cancel',

    // Date related
    noDueDate: 'No due date',
    dueDate: 'Due: ',
    expired: 'Expired',
    today: 'Today',
    tomorrow: 'Tomorrow',
    datePlaceholder: 'Select due date',
    dateFormat: 'MMM DD, YYYY',
    remainingDays: {
      expired: 'Expired',
      today: 'Due today',
      tomorrow: 'Due tomorrow',
      future: '{days} days left'
    },

    // Priority
    priority: {
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      label: 'Priority: '
    },

    // Category
    category: {
      all: 'All',
      none: 'No Category',
      work: 'Work',
      personal: 'Personal',
      shopping: 'Shopping',
      study: 'Study',
      label: 'Category: '
    },

    // Filter and Sort
    filter: {
      label: 'Show category',
      all: 'Show all',
      active: 'Show active',
      completed: 'Show completed'
    },
    sort: {
      label: 'Sort by',
      priority: 'Priority',
      dueDate: 'Due date',
      created: 'Created date',
      updated: 'Updated date'
    },

    // Accessibility
    aria: {
      addTask: 'Add new task',
      editTask: 'Edit {task}',
      deleteTask: 'Delete {task}',
      completeTask: 'Mark {task} as complete',
      uncompleteTask: 'Mark {task} as incomplete',
      taskPriority: 'Priority {priority}',
      taskCategory: 'Category {category}',
      taskDueDate: 'Due {date}',
      taskExpired: 'Expired',
      themeToggle: 'Switch to {theme} mode',
      languageToggle: 'Switch to {language}',
      filterCategory: 'Filter by category',
      sortTasks: 'Sort tasks'
    },

    // Status messages
    statusMessage: '{incomplete} tasks incomplete, {completed} tasks completed',
    emptyState: {
      noTasks: 'No tasks',
      noResults: 'No matching tasks',
      addFirst: 'Add your first task'
    },

    // Error messages
    errors: {
      addFailed: 'Failed to add task',
      updateFailed: 'Failed to update task',
      deleteFailed: 'Failed to delete task',
      loadFailed: 'Failed to load data',
      saveFailed: 'Failed to save data',
      invalidInput: 'Invalid input',
      emptyText: 'Please enter text',
      tooLong: 'Text is too long (max 200 characters)',
      invalidDate: 'Invalid date',
      networkError: 'Network error occurred'
    },

    // Operation guide
    help: {
      addTask: 'Enter text and click "Add" or press Enter to add a task',
      editTask: 'Click on a task to edit',
      completeTask: 'Click checkbox to complete task',
      deleteTask: 'Click delete button to remove task',
      filterTasks: 'Select category to filter tasks',
      keyboard: {
        add: 'Enter: Add task',
        edit: 'Click: Edit task',
        save: 'Enter: Save edit',
        cancel: 'Esc: Cancel edit',
        delete: 'Delete: Remove task'
      }
    }
  }
};
