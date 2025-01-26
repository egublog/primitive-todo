# Primitive Todo

シンプルながら高機能なTodoアプリケーション。モダンなWeb技術とベストプラクティスを活用し、使いやすさと保守性を両立しています。

## 主な機能

- ✨ シンプルで直感的なUI
- 🌓 ライト/ダークテーマ対応
- 🌐 多言語対応（日本語/英語）
- 📱 レスポンシブデザイン
- ♿ アクセシビリティ対応
- 🔄 オフライン対応
- ⚡ 高パフォーマンス

### Todo管理機能

- タスクの追加/編集/削除
- 優先度設定（高/中/低）
- カテゴリー分類
- 期限日設定
- 完了/未完了の管理
- フィルタリング機能

## 技術スタック

### フロントエンド
- HTML5
- CSS3（モジュラーCSS）
- JavaScript（ES6+）

### バックエンド
- Java (Spring Boot)
- SQLite
- Flyway（データベースマイグレーション）
- RESTful API

### アーキテクチャ
- クライアント-サーバーアーキテクチャ
- RESTful APIによる通信
- モジュラー設計
- イベント駆動型アーキテクチャ

## プロジェクト構造

### フロントエンド
```
frontend/
├── js/
│   ├── app.js                 # アプリケーションのエントリーポイント
│   ├── controllers/           # コントローラー
│   │   └── TodoController.js  # Todoの操作を制御
│   ├── models/               # データモデル
│   │   ├── TodoItem.js       # 個別のTodoアイテム
│   │   └── TodoList.js       # Todoリストの管理
│   └── i18n/                 # 国際化
│       └── translations.js    # 翻訳データ
├── styles/
│   ├── main.css              # メインスタイル
│   ├── base.css              # 基本スタイル
│   ├── components/           # コンポーネント別スタイル
│   │   ├── buttons.css
│   │   ├── inputs.css
│   │   ├── todo-item.css
│   │   └── todo-list.css
│   └── themes/               # テーマ
│       ├── light.css
│       └── dark.css
└── index.html                # メインHTML
```

### バックエンド
```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           ├── Application.java       # アプリケーションのエントリーポイント
│   │   │           ├── config/               # 設定関連
│   │   │           │   └── WebConfig.java    # Web設定
│   │   │           ├── controllers/          # コントローラー
│   │   │           │   └── TodoController.java
│   │   │           ├── exceptions/           # 例外処理
│   │   │           │   └── GlobalExceptionHandler.java
│   │   │           ├── models/               # データモデル
│   │   │           │   └── Todo.java
│   │   │           ├── repositories/         # リポジトリ
│   │   │           │   └── TodoRepository.java
│   │   │           └── services/             # サービス層
│   │   │               └── TodoService.java
│   │   └── resources/
│   │       ├── application.properties        # アプリケーション設定
│   │       └── db/
│   │           └── migrations/              # データベースマイグレーション
│   │               └── V1__create_todo_table.sql
└── build.gradle                              # ビルド設定
```

## APIエンドポイント

| メソッド | エンドポイント       | 説明                     |
|----------|----------------------|--------------------------|
| GET      | /api/todos           | Todo一覧取得             |
| POST     | /api/todos           | 新規Todo作成             |
| GET      | /api/todos/{id}      | 特定のTodo取得           |
| PUT      | /api/todos/{id}      | Todo更新                 |
| DELETE   | /api/todos/{id}      | Todo削除                 |

## 開発者向け情報

### 開発環境のセットアップ

1. リポジトリをクローン
```bash
git clone https://github.com/example/primitive-todo.git
cd primitive-todo
```

2. バックエンドのビルドと実行
```bash
cd backend
gradle bootRun
```

3. フロントエンドの実行
```bash
cd ../frontend
open index.html
```

### コーディング規約

- JSDoc/JavaDocによるドキュメンテーション
- コンポーネント単位のスタイル定義
- 意味のある変数/関数名の使用
- RESTful API設計原則の遵守

### テストの実行

バックエンドのテストを実行するには：
```bash
cd backend
gradle test
```

## ライセンス

MIT License
