# Primitive Todo

効率的でシンプルな Todo アプリケーション。モダンな Web 技術とベストプラクティスを活用し、保守性と使いやすさを重視した設計です。

## 技術スタック

### フロントエンド

- HTML5
- CSS3（モジュラー CSS）
- JavaScript（ES6+）
  - カスタムイベント管理
  - モジュラーアーキテクチャ

### バックエンド

- Java (Servlet API)
- SQLite (^3.0.0)
- 純粋な Java による RESTful API 実装

## アーキテクチャ概要

### フロントエンド

```
frontend/
├── js/
│   ├── app.js                    # アプリケーションエントリーポイント
│   ├── controllers/              # ビジネスロジック制御
│   ├── models/                   # データモデル
│   ├── services/                 # 共通サービス
│   │   ├── appInitializer.js    # アプリ初期化
│   │   ├── i18nService.js       # 国際化
│   │   └── themeService.js      # テーマ管理
│   ├── utils/                    # ユーティリティ
│   ├── views/                    # UI管理
│   │   ├── TodoView.js          # メインビュー
│   │   ├── TodoViewBase.js      # 基本機能
│   │   ├── TodoViewDOM.js       # DOM操作
│   │   ├── TodoViewI18n.js      # 国際化
│   │   ├── TodoViewOperations.js # 操作管理
│   │   └── TodoViewRendering.js  # レンダリング
│   └── i18n/                     # 翻訳リソース
└── styles/
    ├── main.css                  # メインスタイル
    ├── base.css                  # 基本スタイル
    ├── components/               # コンポーネント別スタイル
    └── themes/                   # テーマ定義
```

### バックエンド

```
backend/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/example/
│       │       ├── Application.java     # アプリケーションエントリーポイント
│       │       ├── config/             # アプリケーション設定
│       │       ├── controllers/        # Servletベースのコントローラー
│       │       ├── services/           # ビジネスロジック
│       │       ├── repositories/       # SQLiteデータアクセス
│       │       ├── models/            # データモデル
│       │       └── exceptions/         # 例外処理
│       └── resources/
│           └── db/                    # SQLiteデータベース
└── test/                              # テストコード
```

## API 仕様

### エンドポイント一覧

| メソッド | エンドポイント  | 説明             | レスポンス形式 |
| -------- | --------------- | ---------------- | -------------- |
| GET      | /api/todos      | Todo 一覧取得    | TodoDto[]      |
| POST     | /api/todos      | 新規 Todo 作成   | TodoDto        |
| GET      | /api/todos/{id} | 特定の Todo 取得 | TodoDto        |
| PUT      | /api/todos/{id} | Todo 更新        | TodoDto        |
| DELETE   | /api/todos/{id} | Todo 削除        | void           |

### データモデル

#### TodoDto

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "completed": boolean,
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

## 開発環境セットアップ

### 必要要件

- Java Development Kit (JDK)
- SQLite ^3.0.0
- モダンブラウザ（Chrome 推奨）

### インストール手順

1. リポジトリのクローン

```bash
git clone https://github.com/example/primitive-todo.git
cd primitive-todo
```

2. バックエンドのコンパイル

```bash
cd backend
javac -d target src/main/java/com/example/**/*.java
```

3. データベースの初期化

```bash
# SQLiteデータベースファイルの作成
sqlite3 src/main/resources/db/todo.db < src/main/resources/db/schema.sql
```

4. アプリケーションの起動

```bash
# バックエンド起動（Tomcatなどのサーブレットコンテナが必要）
java -cp target com.example.Application

# フロントエンド（別ターミナルで）
cd ../frontend
# macOSの場合
open index.html
# または任意のブラウザでindex.htmlを開く
```

## テスト実行

### バックエンドテスト

```bash
cd backend
javac -d target/test src/test/java/com/example/**/*.java
java -cp target/test com.example.TestRunner
```

### フロントエンドテスト

```bash
cd frontend
# テストランナーを開く
open tests/test.html
```

## 環境変数設定

プロジェクトを実行する前に、以下の環境変数を設定してください：

```bash
# バックエンド設定
DB_PATH=src/main/resources/db/todo.db
SERVER_PORT=8080
LOG_LEVEL=INFO

# フロントエンド設定
API_BASE_URL=http://localhost:8080/api
DEFAULT_LANGUAGE=ja
DEFAULT_THEME=light
```

## セキュリティ

### 実装済みのセキュリティ対策

- CORS 設定
  ```java
  response.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  ```
- セキュリティヘッダー
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Content-Security-Policy
- XSS 対策
  - 入力データのサニタイゼーション
  - エスケープ処理の実装
- SQL インジェクション対策
  - プリペアードステートメントの使用
  - 入力値のバリデーション

## ライセンス

MIT License

Copyright (c) 2024 Primitive Todo
