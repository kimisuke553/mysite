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
  id: number
  date: string
  modified: string
  slug: string
  status: string
  type: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  featured_media: number
  // ACFフィールドを追加
  acf?: {
    thumbnail?: string | ACFImage
    [key: string]: any  // その他のACFフィールド用
  }
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
    }>
    author?: Array<{
      id: number
      name: string
      url: string
    }>
  }
}
export interface WordPressPage {
  id: number
  date: string
  modified: string
  slug: string
  status: string
  type: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  featured_media: number
  parent: number
  menu_order: number
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text: string
    }>
  }
}

export interface WordPressCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  parent: number
}

export interface WordPressTag {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
}
