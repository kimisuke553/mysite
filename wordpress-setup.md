# WordPress ローカル環境セットアップガイド

このガイドでは、Docker Composeを使用してWordPressのローカル環境をセットアップします。

## 前提条件

- Docker Desktop がインストールされていること
  - Windows: https://www.docker.com/products/docker-desktop
  - Mac: https://www.docker.com/products/docker-desktop
  - Linux: `sudo apt-get install docker-compose`

## セットアップ手順

### 1. Docker コンテナの起動

```bash
# WordPressとMySQLコンテナを起動
docker-compose up -d

# 起動確認
docker-compose ps
```

起動には1-2分かかる場合があります。

### 2. WordPress初期セットアップ

ブラウザで http://localhost:8080 を開きます。

WordPress初期設定画面が表示されたら、以下を入力:

1. **サイトのタイトル**: 任意 (例: "My Headless WordPress")
2. **ユーザー名**: admin
3. **パスワード**: 強力なパスワードを設定
4. **メールアドレス**: your-email@example.com
5. **検索エンジンでの表示**: チェックを外す(開発環境のため)

「WordPressをインストール」をクリック。

### 3. パーマリンク設定 (重要)

1. WordPress管理画面にログイン
2. 左メニュー → **設定** → **パーマリンク**
3. **投稿名** を選択
4. **変更を保存**

### 4. CORS設定 (必須)

#### 方法1: functions.php に追加

1. 管理画面 → **外観** → **テーマファイルエディター**
2. 右側から **functions.php** を選択
3. 以下のコードをファイルの最後に追加:

```php
// CORS設定 - ヘッドレスCMS用
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

4. **ファイルを更新** をクリック

#### 方法2: プラグインを使用

1. 管理画面 → **プラグイン** → **新規追加**
2. "CORS" で検索
3. **WP CORS** または **WP REST API CORS** をインストール&有効化

### 5. テスト投稿を作成

1. 管理画面 → **投稿** → **新規追加**
2. タイトルと本文を入力
3. アイキャッチ画像を設定 (オプション)
4. **公開** をクリック

2-3件の投稿を作成すると、フロントエンドでの表示確認がしやすくなります。

### 6. REST API エンドポイントの確認

ブラウザで以下のURLにアクセス:
```
http://localhost:8080/wp-json/wp/v2/posts
```

JSON形式で投稿データが表示されればOKです。

### 7. Next.js の環境変数を更新

`.env.local` を編集:

```env
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8080/wp-json/wp/v2
```

### 8. Next.js 開発サーバーを起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いて、WordPress の投稿が表示されることを確認。

## よく使うコマンド

```bash
# コンテナ起動
docker-compose up -d

# コンテナ停止
docker-compose down

# コンテナ停止 + データ削除(完全リセット)
docker-compose down -v

# ログ確認
docker-compose logs -f wordpress

# コンテナ状態確認
docker-compose ps
```

## トラブルシューティング

### ポート8080が既に使用されている

`docker-compose.yml` の以下の行を変更:
```yaml
ports:
  - "8080:80"  # 8080を別のポート(例: 9000)に変更
```

### WordPressが表示されない

```bash
# コンテナを再起動
docker-compose restart wordpress

# ログを確認
docker-compose logs wordpress
```

### データベース接続エラー

```bash
# MySQLコンテナが起動しているか確認
docker-compose ps

# MySQLログを確認
docker-compose logs db
```

## 推奨プラグイン

開発を進める際に便利なプラグイン:

- **Advanced Custom Fields (ACF)** - カスタムフィールド追加
- **ACF to REST API** - カスタムフィールドをAPIに公開
- **Yoast SEO** - SEO設定とメタデータ
- **Classic Editor** - クラシックエディタを使いたい場合

## Next.js の画像最適化設定

アイキャッチ画像を使用する場合、`next.config.js` を更新:

```javascript
images: {
  domains: ['localhost'],
},
```

これで、Next.jsの `<Image>` コンポーネントでWordPressの画像を使用できます。
