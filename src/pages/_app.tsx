import '../styles/global.css'
import 'katex/dist/katex.css'
import Footer from '../components/footer'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=DotGothic16&family=M+PLUS+Rounded+1c&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
      <Footer />
    </>
  )
}
