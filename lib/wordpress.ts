import { WordPressPost, WordPressPage, WordPressCategory } from '@/types/wordpress';

// WordPress REST API のベースURL
const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost/wp-json/wp/v2';

/**
 * WordPress REST APIからデータを取得
 */
async function fetchAPI(endpoint: string, params: Record<string, any> = {}) {
  const url = new URL(`${WP_API_URL}${endpoint}`);

  // クエリパラメータを追加
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 }, // 60秒ごとに再検証(ISR)
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status}`);
  }

  return response.json();
}

/**
 * 投稿一覧を取得
 */
export async function getPosts(params: {
  page?: number;
  per_page?: number;
  categories?: string;
  search?: string;
} = {}): Promise<WordPressPost[]> {
  const defaultParams = {
    _embed: 'true', // 埋め込みデータ(アイキャッチ画像など)を含める
    per_page: 10,
    ...params,
  };

  return fetchAPI('/posts', defaultParams);
}

/**
 * スラッグから投稿を取得
 */
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  const posts = await fetchAPI('/posts', {
    slug,
    _embed: 'true',
  });

  return posts.length > 0 ? posts[0] : null;
}

/**
 * IDから投稿を取得
 */
export async function getPostById(id: number): Promise<WordPressPost> {
  return fetchAPI(`/posts/${id}`, { _embed: 'true' });
}

/**
 * ページ一覧を取得
 */
export async function getPages(): Promise<WordPressPage[]> {
  return fetchAPI('/pages', { _embed: 'true' });
}

/**
 * スラッグからページを取得
 */
export async function getPageBySlug(slug: string): Promise<WordPressPage | null> {
  const pages = await fetchAPI('/pages', {
    slug,
    _embed: 'true',
  });

  return pages.length > 0 ? pages[0] : null;
}

/**
 * カテゴリ一覧を取得
 */
export async function getCategories(): Promise<WordPressCategory[]> {
  return fetchAPI('/categories');
}

/**
 * すべての投稿のスラッグを取得(静的パス生成用)
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await fetchAPI('/posts', {
    per_page: 100, // 必要に応じて調整
    _fields: 'slug', // slugのみ取得
  });

  return posts.map((post: WordPressPost) => post.slug);
}
