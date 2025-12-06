export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Headless WordPress + React. All rights reserved.</p>
      </div>
      <style jsx>{`
        .footer {
          background-color: #fafafa;
          border-top: 1px solid #eaeaea;
          padding: 2rem 0;
          margin-top: 4rem;
          text-align: center;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }
      `}</style>
    </footer>
  );
}
