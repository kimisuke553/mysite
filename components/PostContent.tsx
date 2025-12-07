'use client'
import Link from 'next/link'
import { WordPressPost } from '@/types/wordpress'

interface PostCardProps {
  post: WordPressPost
}

/**
 * 投稿画像を取得する関数
 * 優先順位: ACFサムネイル → アイキャッチ画像
 */
function getPostImage(post: WordPressPost): string | null {
  // 1. ACFカスタムフィールドのサムネイル画像を優先
  if (post.acf && typeof post.acf === 'object' && !Array.isArray(post.acf)) {
    const thumbnail = (post.acf as any).thumbnail
    if (thumbnail) {
      if (typeof thumbnail === 'object' && thumbnail.url) {
        return thumbnail.url
      }
      if (typeof thumbnail === 'string') {
        return thumbnail
      }
    }
  }

  // 2. WordPressのアイキャッチ画像をフォールバック
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null
}

export default function PostCard({ post }: PostCardProps) {
  const postImage = getPostImage(post)

  return (
    <article className="post-card">
      <Link href={`/posts/${post.slug}`} className="post-link">
        {postImage && (
          <div className="post-image">
            <img src={postImage} alt={post.title.rendered} />
          </div>
        )}

        <div className="post-content">
          <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          
          <div 
            className="post-excerpt"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} 
          />

          <time dateTime={post.date} className="post-date">
            {new Date(post.date).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </Link>

      <style jsx>{`
        .post-card {
          border: 1px solid #eaeaea;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .post-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .post-link {
          display: block;
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
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        .post-excerpt {
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.6;
        }
        .post-excerpt :global(p) {
          margin: 0;
        }
        .post-date {
          display: block;
          font-size: 0.875rem;
          color: #999;
        }
      `}</style>
    </article>
  )
}