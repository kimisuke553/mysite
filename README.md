# Headless WordPress + React (Next.js)

WordPress REST APIをバックエンドとして使用し、Next.jsでフロントエンドを構築するヘッドレスCMS環境です。

## 📋 概要

このプロジェクトは、WordPressをヘッドレスCMSとして使用し、Reactで高速なフロントエンドを構築するための初期環境です。

### 特徴

- ✅ **Next.js 14** - App Router使用
- ✅ **TypeScript** - 型安全な開発
- ✅ **WordPress REST API** - 標準APIを使用
- ✅ **ISR (Incremental Static Regeneration)** - 高速なページ表示
- ✅ **レスポンシブデザイン** - モバイル対応

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成:

```bash
cp .env.local.example .env.local
```

`.env.local` を編集して、WordPressサイトのURLを設定:

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 🔧 WordPress側の設定

### 必須設定

1. **パーマリンク設定**
   - WordPress管理画面 → 設定 → パーマリンク
   - 「投稿名」を選択して保存

2. **REST APIの有効化**
   - WordPress 4.7以降では標準で有効
   - エンドポイント確認: `https://your-site.com/wp-json/wp/v2/posts`

### 推奨プラグイン

#### CORS設定 (必須)

異なるドメインからのAPIアクセスを許可するため、以下のコードを `functions.php` に追加:

```php
// CORS設定
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type');
        return $value;
    });
}, 15);
```

**または** プラグインを使用:
- [WPGraphQL CORS](https://wordpress.org/plugins/wp-graphql-cors/) (推奨)

#### その他の推奨プラグイン

- **Advanced Custom Fields (ACF)** - カスタムフィールド
- **ACF to REST API** - カスタムフィールドをREST APIに公開
- **Yoast SEO** - SEO対策、メタデータ管理
- **WP REST API Controller** - APIのカスタマイズ

### アイキャッチ画像の設定

アイキャッチ画像を表示するには:

1. WordPress管理画面で投稿にアイキャッチ画像を設定
2. `next.config.js` の `images.domains` にWordPressドメインを追加:

```javascript
images: {
  domains: ['your-wordpress-site.com'],
},
```

## 📁 プロジェクト構造

```
.
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # トップページ
│   ├── globals.css        # グローバルCSS
│   └── posts/
│       ├── page.tsx       # 記事一覧ページ
│       └── [slug]/
│           └── page.tsx   # 記事詳細ページ
├── components/            # Reactコンポーネント
│   ├── Header.tsx        # ヘッダー
│   ├── Footer.tsx        # フッター
│   └── PostCard.tsx      # 記事カード
├── lib/                   # ユーティリティ関数
│   └── wordpress.ts      # WordPress API関数
├── types/                 # TypeScript型定義
│   └── wordpress.ts      # WordPress型定義
└── public/               # 静的ファイル
```

## 🛠️ 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# リント実行
npm run lint
```

## 📝 使い方

### 投稿の取得

```typescript
import { getPosts, getPostBySlug } from '@/lib/wordpress';

// 投稿一覧を取得
const posts = await getPosts({ per_page: 10 });

// スラッグから投稿を取得
const post = await getPostBySlug('hello-world');
```

### カスタムフィールドの使用

ACFプラグインと「ACF to REST API」を使用している場合:

```typescript
export interface WordPressPost {
  // ... 既存の型定義
  acf?: {
    custom_field_name: string;
    // カスタムフィールドを追加
  };
}
```

## 🌐 デプロイ

### Vercel (推奨)

1. [Vercel](https://vercel.com)にプロジェクトをインポート
2. 環境変数 `NEXT_PUBLIC_WORDPRESS_API_URL` を設定
3. デプロイ

### その他のホスティング

- Netlify
- AWS Amplify
- Cloudflare Pages

すべてNext.jsをサポートするプラットフォームで動作します。

## 🔒 セキュリティ

### 本番環境での注意点

1. **CORS設定を適切に制限**
   ```php
   header('Access-Control-Allow-Origin: https://your-frontend-domain.com');
   ```

2. **非公開データの保護**
   - REST APIで公開したくないデータは、カスタムエンドポイントで認証を実装

3. **レート制限**
   - WordPress側でレート制限を設定することを推奨

## 📚 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [React Documentation](https://react.dev)

## 🤝 今後の拡張

このベース環境から以下の機能を追加できます:

- [ ] カテゴリ・タグページ
- [ ] 検索機能
- [ ] ページネーション
- [ ] コメント表示
- [ ] 認証機能 (ユーザーログイン)
- [ ] WPGraphQL対応
- [ ] 多言語対応 (i18n)
- [ ] サイトマップ生成
- [ ] OGP画像の自動生成

## ライセンス

MIT