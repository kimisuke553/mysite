import { getPostBySlug, getAllPostSlugs } from '@/lib/wordpress'
import { notFound } from 'next/navigation'
import PostContent from '@/components/PostContent'

interface PostPageProps {
  params: {
    slug: string
  }
}

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