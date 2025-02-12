# Primitive Todo

効率的でシンプルなTodoアプリケーション。モダンなWeb技術とベストプラクティスを活用し、保守性と使いやすさを重視した設計です。

## 主な機能

### 基本機能
- タスクの追加/編集/削除
- カテゴリー分類
- 完了/未完了の管理
- フィルタリング機能

### 技術的特徴
- ライト/ダークテーマ対応
- 多言語対応（日本語/英語）
- レスポンシブデザイン
- アクセシビリティ対応
- 高パフォーマンス

## 技術スタック

### フロントエンド
- HTML5
- CSS3（モジュラーCSS）
- JavaScript（ES6+）
  - カスタムイベント管理
  - モジュラーアーキテクチャ

### バックエンド
- Java
- SQLite (^3.0.0)
- RESTful API

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
│       │       ├── controllers/  # APIエンドポイント
│       │       ├── services/     # ビジネスロジック
│       │       ├── repositories/ # データアクセス
│       │       ├── models/      # データモデル
│       │       ├── dto/         # データ転送オブジェクト
│       │       ├── mappers/     # モデル変換
│       │       └── exceptions/   # 例外処理
│       └── resources/
│           └── db/migrations/    # DBマイグレーション
└── test/                        # テストコード
```

## APIエンドポイント

| メソッド | エンドポイント    | 説明           | レスポンス形式 |
|---------|-----------------|----------------|--------------|
| GET     | /api/todos     | Todo一覧取得     | TodoDto[]    |
| POST    | /api/todos     | 新規Todo作成     | TodoDto      |
| GET     | /api/todos/{id}| 特定のTodo取得   | TodoDto      |
| PUT     | /api/todos/{id}| Todo更新        | TodoDto      |
| DELETE  | /api/todos/{id}| Todo削除        | void         |

## 開発環境セットアップ

### 必要要件
- Java Development Kit (JDK)
- SQLite ^3.0.0
- モダンブラウザ（Chrome推奨）

### インストール手順

1. リポジトリのクローン
```bash
git clone https://github.com/example/primitive-todo.git
cd primitive-todo
```

2. バックエンドの設定
```bash
cd backend
./gradlew build
```

3. データベースの初期化
```bash
./gradlew flywayMigrate
```

4. アプリケーションの起動
```bash
# バックエンド起動
./gradlew bootRun

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
./gradlew test
```

### フロントエンドテスト
```bash
cd frontend
# テストランナーを開く
open tests/test.html
```

## 開発ガイドライン

### コーディング規約
- クリーンアーキテクチャの原則に従う
- 各コンポーネントは単一責任の原則を遵守
- JSDoc/JavaDocによるドキュメント化
- 意味のある命名規則の遵守

### コミット規約
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント更新
- style: コードスタイル修正
- refactor: リファクタリング
- test: テスト関連
- chore: ビルド・補助ツール関連

## ライセンス

MIT License

Copyright (c) 2024 Primitive Todo
