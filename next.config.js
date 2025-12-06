/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      // WordPress画像ドメインをここに追加
      // 例: 'your-wordpress-site.com'
    ],
  },
}

module.exports = nextConfig
