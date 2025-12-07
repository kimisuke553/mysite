'use client'
import Link from 'next/link'
import type { WordPressPost } from '@/types/wordpress'

interface PostCardProps {
  post: WordPressPost
}

/**
 * コンテンツから最初の画像URLを抽出
 */
function extractImageFromContent(content: string): string | null {
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i)
  return imgMatch ? imgMatch[1] : null
}

/**
 * 相対パスを絶対パスに変換
 */
function convertToAbsoluteUrl(url: string | null): string | null {
  if (!url) return null
  
  // 既に絶対パスの場合はそのまま返す
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // 相対パスの場合、WordPressのベースURLと結合
  const baseUrl = 'https://www.otsuma.ed.jp'
  
  // スラッシュで始まる場合
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`
  }
  
  // それ以外の相対パス
  return `${baseUrl}/${url}`
}

/**
 * 投稿画像を取得する関数
 */
function getPostImage(post: WordPressPost): string | null {
  // 1. ACFカスタムフィールドのサムネイル画像を優先
  if (post.acf && typeof post.acf === 'object' && !Array.isArray(post.acf)) {
    const thumbnail = (post.acf as any).thumbnail
    if (thumbnail) {
      if (typeof thumbnail === 'object' && thumbnail.url) {
        return convertToAbsoluteUrl(thumbnail.url)
      }
      if (typeof thumbnail === 'string') {
        return convertToAbsoluteUrl(thumbnail)
      }
    }
  }

  // 2. WordPressのアイキャッチ画像
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  if (featuredMedia) {
    return convertToAbsoluteUrl(featuredMedia)
  }

  // 3. コンテンツ内の最初の画像を取得
  if (post.content?.rendered) {
    const contentImage = extractImageFromContent(post.content.rendered)
    if (contentImage) {
      return convertToAbsoluteUrl(contentImage)
    }
  }

  return null
}

export default function PostCard({ post }: PostCardProps) {
  const postImage = getPostImage(post)
  
  // デバッグ用
  console.log('画像URL:', postImage)

  return (
    <article className="post-card">
      <Link href={`/posts/${post.slug}`}>
        <div className="post-card-inner">
          {postImage && (
            <div className="post-image">
              <img 
                src={postImage} 
                alt={post.title.rendered}
                onError={(e) => {
                  console.error('画像読み込みエラー:', postImage)
                  e.currentTarget.style.display = 'none'
                }}
                onLoad={() => {
                  console.log('画像読み込み成功:', postImage)
                }}
              />
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
        </div>
      </Link>

      <style jsx>{`
        .post-card {
          border: 1px solid #eaeaea;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          background: #fff;
        }
        .post-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .post-card :global(a) {
          display: block;
          text-decoration: none;
          color: inherit;
        }
        .post-card-inner {
          display: block;
        }
        .post-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f5f5f5;
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
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          color: #333;
        }
        .post-excerpt {
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.6;
          font-size: 0.9rem;
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