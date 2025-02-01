# Primitive Todo

シンプルで効率的なTodoアプリケーション。モダンなWeb技術とベストプラクティスを活用し、使いやすさと保守性を両立しています。

## 主な機能

- ✨ シンプルで直感的なUI
- 🌓 ライト/ダークテーマ対応
- 🌐 多言語対応(日本語/英語)
- 📱 レスポンシブデザイン
- ♿ アクセシビリティ対応
- ⚡ 高パフォーマンス

### Todo管理機能

- タスクの追加/編集/削除
- カテゴリー分類
- 完了/未完了の管理
- フィルタリング機能

## 技術スタック

### フロントエンド
- HTML5
- CSS3(モジュラーCSS)
- JavaScript(ES6+)

### バックエンド
- Java
- SQLite
- RESTful API

## プロジェクト構造

### フロントエンド
```
frontend/
├── index.html                # メインHTML
├── js/
│   ├── app.js               # アプリケーションのエントリーポイント
│   ├── controllers/
│   │   └── TodoController.js # Todoの操作を制御
│   ├── models/
│   │   ├── TodoItem.js      # 個別のTodoアイテム
│   │   └── TodoList.js      # Todoリストの管理
│   ├── utils/
│   │   └── api.js          # API通信用ユーティリティ
│   ├── views/
│   │   └── TodoView.js     # Todo表示用ビュー
│   └── i18n/
│       └── translations.js  # 翻訳データ
└── styles/
    ├── main.css            # メインスタイル
    ├── base.css            # 基本スタイル
    ├── components/         # コンポーネント別スタイル
    │   ├── buttons.css
    │   ├── inputs.css
    │   ├── todo-item.css
    │   └── todo-list.css
    └── themes/             # テーマ
        ├── light.css
        └── dark.css
```

### バックエンド
```
backend/
├── build.gradle            # ビルド設定
├── settings.gradle         # Gradle設定
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── example/
        │           ├── Application.java      # アプリケーションのエントリーポイント
        │           ├── config/              # 設定関連
        │           │   └── WebConfig.java   # Web設定
        │           ├── controllers/         # コントローラー
        │           │   └── TodoController.java
        │           ├── exceptions/          # 例外処理
        │           │   └── GlobalExceptionHandler.java
        │           ├── models/              # データモデル
        │           │   └── Todo.java
        │           ├── repositories/        # リポジトリ
        │           │   └── TodoRepository.java
        │           └── services/            # サービス層
        │               └── TodoService.java
        └── resources/
            ├── application.properties      # アプリケーション設定
            └── db/
                └── migrations/            # データベースマイグレーション
                    └── V1__create_todo_table.sql
```

## APIエンドポイント

| メソッド | エンドポイント       | 説明                     |
|----------|----------------------|--------------------------|
| GET      | /api/todos           | Todo一覧取得             |
| POST     | /api/todos           | 新規Todo作成             |
| GET      | /api/todos/{id}      | 特定のTodo取得           |
| PUT      | /api/todos/{id}      | Todo更新                 |
| DELETE   | /api/todos/{id}      | Todo削除                 |

## 開発環境のセットアップ

### 必要な環境
- Java Development Kit (JDK)
- SQLite: ^3.0.0

### セットアップ手順

1. リポジトリをクローン
```bash
git clone https://github.com/example/primitive-todo.git
cd primitive-todo
```

2. バックエンドのセットアップと実行
```bash
cd backend
./gradlew build
./gradlew bootRun
```

3. フロントエンドの実行
```bash
cd ../frontend
open index.html  # macOSの場合
# または直接ブラウザでindex.htmlを開いてください
```

## 開発ガイドライン

### コーディング規約

- JSDoc/JavaDocによるドキュメンテーション
- コンポーネント単位のスタイル定義
- 意味のある変数/関数名の使用
- RESTful API設計原則の遵守

### テスト

バックエンドのテストを実行:
```bash
cd backend
./gradlew test
```

## ライセンス

MIT License
