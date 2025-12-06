import { getPosts } from '@/lib/wordpress';
import PostCard from '@/components/PostCard';

export default async function PostsPage() {
  let posts;
  let error = null;

  try {
    posts = await getPosts({ per_page: 20 });
  } catch (e) {
    error = e instanceof Error ? e.message : 'データの取得に失敗しました';
  }

  return (
    <div className="container">
      <h1 className="page-title">記事一覧</h1>

      {error ? (
        <div className="error">
          <p>{error}</p>
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
