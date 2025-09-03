import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="TrustX - AI + Blockchain Powered Investor Protection Network" />
        <meta name="keywords" content="fraud detection, investment protection, SEBI, blockchain, AI" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Meta tags for social sharing */}
        <meta property="og:title" content="TrustX - Investment Fraud Detection" />
        <meta property="og:description" content="Protect yourself from investment frauds with AI-powered detection and blockchain verification" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TrustX - Investment Fraud Detection" />
        <meta name="twitter:description" content="Detect fraud with AI, secure truth with blockchain" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}