import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon-sbc.png" />

        {/* Title */}
        <title>Samy Bouard Cart</title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Samy Bouard Cart is a French director obsessed by image and its evocative power. He works mainly on fashion campaigns, music documentaries and feature films."
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Samy Bouard Cart" />
        <meta
          property="og:description"
          content="Samy Bouard Cart is a French director obsessed by image and its evocative power. He works mainly on fashion campaigns, music documentaries and feature films."
        />
        <meta property="og:image" content="/og-sbc.jpg" />
        <meta property="og:url" content="https://samybouardcart.com/" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Samy Bouard Cart" />
        <meta
          name="twitter:description"
          content="Samy Bouard Cart is a French director obsessed by image and its evocative power. He works mainly on fashion campaigns, music documentaries and feature films."
        />
        <meta name="twitter:image" content="/og-sbc.jpg" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
