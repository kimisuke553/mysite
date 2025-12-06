import { getPosts } from '@/lib/wordpress';
import PostCard from '@/components/PostCard';

export default async function Home() {
  let posts;
  let error = null;

  try {
    posts = await getPosts({ per_page: 6 });
  } catch (e) {
    error = e instanceof Error ? e.message : 'データの取得に失敗しました';
  }

  return (
    <div className="container">
      <h1 className="page-title">最新記事</h1>

      {error ? (
        <div className="error">
          <p>{error}</p>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            WordPress APIのURL設定を確認してください。
            <br />
            環境変数 NEXT_PUBLIC_WORDPRESS_API_URL を設定する必要があります。
          </p>
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="loading">記事がありません</p>
      )}
    </div>
  );
}
