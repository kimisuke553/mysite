# ACFカスタムフィールド設定ガイド

このガイドでは、Advanced Custom Fields (ACF) プラグインを使用してカスタムフィールドを追加し、Next.jsアプリで表示する方法を説明します。

## 前提条件

- WordPressがインストールされていること
- Advanced Custom Fields (ACF) プラグインがインストール済み

## WordPress側の設定

### 1. ACFプラグインのインストール

1. WordPress管理画面 → **プラグイン** → **新規追加**
2. "Advanced Custom Fields" で検索
3. **今すぐインストール** → **有効化**

### 2. ACF to REST API プラグインのインストール

ACFフィールドをREST APIで公開するために必要です。

1. **プラグイン** → **新規追加**
2. "ACF to REST API" で検索
3. **今すぐインストール** → **有効化**

### 3. カスタムフィールドグループの作成

#### サムネイル画像フィールドの追加

1. 管理画面 → **カスタムフィールド** → **新規追加**
2. フィールドグループ名: 「投稿フィールド」など
3. **フィールドを追加**:
   - **フィールドラベル**: サムネイル画像
   - **フィールド名**: `thumbnail`
   - **フィールドタイプ**: 画像
   - **返り値のフォーマット**: 画像配列 または 画像URL
4. **位置**:
   - 投稿タイプ が 投稿 に等しい
5. **公開**

### 4. REST APIでの公開設定

フィールド設定画面で以下を確認:

- **REST APIで表示**: 有効

または、フィールドグループ編集画面で:
- **Show in REST API**: Yes

## 投稿への画像追加

1. 投稿編集画面を開く
2. 下にスクロールして「サムネイル画像」フィールドを見つける
3. **画像を選択** をクリック
4. 画像をアップロードまたは選択
5. 投稿を保存

## Next.js側の実装

### 型定義 (すでに実装済み)

`types/wordpress.ts` には以下が定義されています:

```typescript
export interface ACFImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  sizes?: {
    thumbnail?: string;
    medium?: string;
    large?: string;
  };
}

export interface WordPressPost {
  // ... 他のフィールド
  acf?: {
    thumbnail?: string | ACFImage;
    [key: string]: any;
  };
}
```

### 画像表示ロジック (すでに実装済み)

PostCardコンポーネントと記事詳細ページには、以下の優先順位で画像を表示する機能が実装されています:

1. **ACFカスタムフィールドの `thumbnail`**
2. **WordPressアイキャッチ画像** (フォールバック)

## カスタムフィールドの追加例

### テキストフィールドの追加

```typescript
// types/wordpress.ts に追加
export interface WordPressPost {
  acf?: {
    thumbnail?: string | ACFImage;
    subtitle?: string;        // サブタイトル
    reading_time?: number;    // 読了時間
    custom_link?: string;     // カスタムリンク
  };
}
```

### コンポーネントでの使用

```tsx
// components/PostCard.tsx
export default function PostCard({ post }: PostCardProps) {
  const postImage = getPostImage(post);
  const subtitle = post.acf?.subtitle;
  const readingTime = post.acf?.reading_time;

  return (
    <article className="post-card">
      <Link href={`/posts/${post.slug}`}>
        {postImage && (
          <div className="post-image">
            <img src={postImage} alt={post.title.rendered} />
          </div>
        )}
        <div className="post-content">
          <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          {subtitle && <p className="subtitle">{subtitle}</p>}
          {readingTime && <span className="reading-time">{readingTime}分で読めます</span>}
          {/* ... */}
        </div>
      </Link>
    </article>
  );
}
```

## APIエンドポイントの確認

カスタムフィールドが正しく表示されているか確認:

```bash
# ブラウザまたはcurlで確認
curl http://your-wordpress-site.com/wp-json/wp/v2/posts/1
```

レスポンス例:
```json
{
  "id": 1,
  "title": { "rendered": "投稿タイトル" },
  "acf": {
    "thumbnail": {
      "url": "http://example.com/wp-content/uploads/image.jpg",
      "alt": "画像の説明",
      "width": 800,
      "height": 600
    },
    "subtitle": "サブタイトル",
    "reading_time": 5
  }
}
```

## トラブルシューティング

### ACFフィールドがREST APIに表示されない

1. **ACF to REST API** プラグインが有効化されているか確認
2. フィールドグループ設定で **Show in REST API** が有効か確認
3. WordPressキャッシュをクリア

### 画像が表示されない

1. ACFフィールド名が `thumbnail` と一致しているか確認
2. 返り値のフォーマットが「画像配列」または「画像URL」になっているか確認
3. `next.config.js` の `images.domains` にWordPressドメインが追加されているか確認

### CORS エラー

WordPress側で CORS 設定が必要です。`README.md` の「WordPress側の設定」セクションを参照してください。

## その他のACFフィールドタイプ

ACFは以下のフィールドタイプをサポートしています:

- テキスト、テキストエリア
- 数値、範囲
- 画像、ファイル、ギャラリー
- 選択、チェックボックス、ラジオボタン
- 真偽値（True/False）
- リンク、ページリンク
- リレーションシップ、タクソノミー
- Google Map
- 日付・時刻

詳細は [ACF公式ドキュメント](https://www.advancedcustomfields.com/resources/) を参照してください。
