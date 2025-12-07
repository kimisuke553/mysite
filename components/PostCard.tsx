'use client'
import Link from 'next/link';
import { WordPressPost } from '@/types/wordpress';

interface PostCardProps {
  post: WordPressPost;
}

/**
 * 投稿画像を取得する関数
 * 優先順位: ACFサムネイル → アイキャッチ画像
 */
function getPostImage(post: WordPressPost): string | null {
  // 1. ACFカスタムフィールドのサムネイル画像を優先
  if (post.acf?.thumbnail) {
    // ACF画像がオブジェクトの場合
    if (typeof post.acf.thumbnail === 'object' && post.acf.thumbnail.url) {
      return post.acf.thumbnail.url;
    }
    // ACF画像が文字列（URL）の場合
    if (typeof post.acf.thumbnail === 'string') {
      return post.acf.thumbnail;
    }
  }

  // 2. WordPressのアイキャッチ画像をフォールバック
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
}

export default function PostCard({ post }: PostCardProps) {
  const postImage = getPostImage(post);
  const author = post._embedded?.author?.[0]?.name;

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
          <div className="post-meta">
            <span className="date">{new Date(post.date).toLocaleDateString('ja-JP')}</span>
            {author && <span className="author">by {author}</span>}
          </div>
          <div
            className="excerpt"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />
        </div>
      </Link>
      <style jsx>{`
        .post-card {
          border: 1px solid #eaeaea;
          border-radius: 8px;
          overflow: hidden;
          transition: box-shadow 0.2s;
          background: #fff;
        }
        .post-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .post-card a {
          text-decoration: none;
          color: inherit;
        }
        .post-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
        }
        .post-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .post-content {
          padding: 1.5rem;
        }
        .post-content h2 {
          margin: 0 0 0.5rem;
          font-size: 1.5rem;
          color: #333;
        }
        .post-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.85rem;
          color: #666;
        }
        .excerpt {
          color: #666;
          line-height: 1.6;
        }
        .excerpt :global(p) {
          margin: 0;
        }
      `}</style>
    </article>
  );
}
