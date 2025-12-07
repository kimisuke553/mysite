import { getPostBySlug, getAllPostSlugs } from '@/lib/wordpress'
import type { WordPressPost } from '@/lib/wordpress'
import { notFound } from 'next/navigation'
import PostContent from '@/components/PostContent'

interface PostPageProps {
  params: {
    slug: string
  }
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
    const slugs = await getAllPostSlugs()
    return slugs.map((slug) => ({
      slug,
    }))
  } catch (error) {
    return []
  }
}

export default async function PostPage({ params }: PostPageProps) {
  let post

  try {
    post = await getPostBySlug(params.slug)
  } catch (error) {
    notFound()
  }

  if (!post) {
    notFound()
  }
  return <PostContent post={post} />
}
