import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <h1 className="logo">
            <Link href="/">ロゴ</Link>
          </h1>
          <nav className="nav">
            <ul>
              <li>
                <Link href="/">ホーム</Link>
              </li>
              <li>
                <Link href="/posts">記事一覧</Link>
              </li>
              <li>
                <Link href="/about">概要</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <style jsx>{`
        .header {
          background-color: #fff;
          border-bottom: 1px solid #eaeaea;
          padding: 1rem 0;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          margin: 0;
          font-size: 1.5rem;
        }
        .logo a {
          color: #333;
          text-decoration: none;
        }
        .nav ul {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 2rem;
        }
        .nav a {
          color: #666;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav a:hover {
          color: #0070f3;
        }
      `}</style>
    </header>
  );
}
