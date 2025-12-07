import { getPostBySlug, getAllPostSlugs } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import { WordPressPost } from '@/types/wordpress';

interface PostPageProps {
  params: {
    slug: string;
  };
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

// 静的パスの生成(オプション)
export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs();
    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    return [];
  }
}

export default async function PostPage({ params }: PostPageProps) {
  let post;

  try {
    post = await getPostBySlug(params.slug);
  } catch (error) {
    notFound();
  }

  if (!post) {
    notFound();
  }

  const postImage = getPostImage(post);
  const author = post._embedded?.author?.[0]?.name;

  return (
    <article className="post-detail">
      <div className="container">
        {postImage && (
          <div className="featured-image">
            <img src={postImage} alt={post.title.rendered} />
          </div>
        )}

        <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

        <div className="post-meta">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {author && <span className="author">著者: {author}</span>}
        </div>

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </div>

      <style jsx>{`
        .post-detail {
          padding: 2rem 0;
        }
        .featured-image {
          width: 100%;
          max-height: 500px;
          overflow: hidden;
          margin-bottom: 2rem;
          border-radius: 8px;
        }
        .featured-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .post-detail h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .post-meta {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eaeaea;
          color: #666;
          font-size: 0.9rem;
        }
        .post-content {
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          line-height: 1.8;
        }
        .post-content :global(img) {
          max-width: 100%;
          height: auto;
        }
        .post-content :global(h2) {
          font-size: 1.8rem;
          margin: 2rem 0 1rem;
        }
        .post-content :global(h3) {
          font-size: 1.5rem;
          margin: 1.5rem 0 1rem;
        }
        .post-content :global(p) {
          margin-bottom: 1rem;
        }
        .post-content :global(pre) {
          background: #f5f5f5;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
        }
        .post-content :global(code) {
          background: #f5f5f5;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }
      `}</style>
    </article>
  );
}
