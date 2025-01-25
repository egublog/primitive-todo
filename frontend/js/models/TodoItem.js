/**
 * Todoアイテムを表すクラス
 */
export class TodoItem {
  /** @type {string[]} */
  static VALID_PRIORITIES = ['low', 'medium', 'high'];
  
  /** @type {string[]} */
  static VALID_CATEGORIES = ['none', 'work', 'personal', 'shopping', 'study'];

  /**
   * @param {string} title - Todoのタイトル
   * @param {string} [description=''] - Todoの説明
   * @param {string} [priority='medium'] - 優先度
   * @param {boolean} [completed=false] - 完了状態
   * @param {string|null} [dueDate=null] - 期限日（YYYY-MM-DD形式）
   * @param {string} [category='none'] - カテゴリー
   * @throws {Error} 無効なパラメータが渡された場合
   */
  constructor(title, description = '', priority = 'medium', completed = false, dueDate = null, category = 'none') {
    this.validateTitle(title);
    this.validatePriority(priority);
    this.validateCategory(category);
    if (dueDate) this.validateDueDate(dueDate);

    this.title = title.trim();
    this.description = description.trim();
    this.priority = priority;
    this.completed = Boolean(completed);
    this.dueDate = dueDate;
    this.category = category;
    this.id = this.generateId();
    this.createdAt = new Date().toISOString();
    this.updatedAt = this.createdAt;
  }

  /**
   * ユニークIDを生成
   * @private
   * @returns {string}
   */
  generateId() {
    return `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * タイトルのバリデーション
   * @private
   * @param {string} title
   * @throws {Error}
   */
  validateTitle(title) {
    if (!title || typeof title !== 'string') {
      throw new Error('タイトルは必須です');
    }
    if (title.trim().length === 0) {
      throw new Error('タイトルが空です');
    }
    if (title.length > 200) {
      throw new Error('タイトルは200文字以内で入力してください');
    }
  }

  /**
   * 優先度のバリデーション
   * @private
   * @param {string} priority
   * @throws {Error}
   */
  validatePriority(priority) {
    if (!TodoItem.VALID_PRIORITIES.includes(priority)) {
      throw new Error(`無効な優先度です: ${priority}`);
    }
  }

  /**
   * カテゴリーのバリデーション
   * @private
   * @param {string} category
   * @throws {Error}
   */
  validateCategory(category) {
    if (!TodoItem.VALID_CATEGORIES.includes(category)) {
      throw new Error(`無効なカテゴリーです: ${category}`);
    }
  }

  /**
   * 期限日のバリデーション
   * @private
   * @param {string} dueDate
   * @throws {Error}
   */
  validateDueDate(dueDate) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      throw new Error('無効な日付形式です');
    }
  }

  /**
   * 期限切れかどうかを判定
   * @returns {boolean}
   */
  isExpired() {
    if (!this.dueDate || this.completed) return false;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dueDate = new Date(this.dueDate);
    return dueDate < now;
  }

  /**
   * 期限までの残り日数を計算
   * @returns {number|null} 残り日数（期限日が設定されていない場合はnull）
   */
  getDaysUntilDue() {
    if (!this.dueDate) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dueDate = new Date(this.dueDate);
    const diffTime = dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Todoの内容を更新
   * @param {Partial<TodoItem>} updates - 更新内容
   * @throws {Error} バリデーションエラー
   */
  update(updates) {
    if (updates.title !== undefined) {
      this.validateTitle(updates.title);
      this.title = updates.title.trim();
    }
    if (updates.description !== undefined) {
      this.description = updates.description.trim();
    }
    if (updates.priority !== undefined) {
      this.validatePriority(updates.priority);
      this.priority = updates.priority;
    }
    if (updates.category !== undefined) {
      this.validateCategory(updates.category);
      this.category = updates.category;
    }
    if (updates.dueDate !== undefined) {
      if (updates.dueDate) this.validateDueDate(updates.dueDate);
      this.dueDate = updates.dueDate;
    }
    if (updates.completed !== undefined) {
      this.completed = Boolean(updates.completed);
    }
    this.updatedAt = new Date().toISOString();
  }

  /**
   * 完了状態を切り替え
   */
  toggleComplete() {
    this.completed = !this.completed;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * オブジェクトをJSON形式に変換
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      priority: this.priority,
      category: this.category,
      dueDate: this.dueDate,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
