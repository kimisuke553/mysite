// WordPress REST API の型定義

// ACF画像フィールドの型定義
export interface ACFImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  sizes?: {
    thumbnail?: string;
    medium?: string;
    large?: string;
    [key: string]: string | undefined;
  };
}

export interface WordPressPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  acf?: {
    custom_field_name: string;
    // カスタムフィールドを追加
  };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    author?: Array<{
      name: string;
      avatar_urls?: {
        [key: string]: string;
      };
    }>;
  };
  // ACFカスタムフィールド
  acf?: {
    thumbnail?: string | ACFImage; // サムネイル画像（URLまたはオブジェクト）
    [key: string]: any; // その他のカスタムフィールド
  };
}

export interface WordPressPage {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}
