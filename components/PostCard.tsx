import Link from 'next/link';
import { WordPressPost } from '@/types/wordpress';

interface PostCardProps {
  post: WordPressPost;
}

export default function PostCard({ post }: PostCardProps) {
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const author = post._embedded?.author?.[0]?.name;

  return (
    <article className="post-card">
      <Link href={`/posts/${post.slug}`}>
        {featuredImage && (
          <div className="post-image">
            <img src={featuredImage} alt={post.title.rendered} />
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
