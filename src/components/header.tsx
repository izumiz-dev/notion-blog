import Link from 'next/link'
import Head from 'next/head'
import ExtLink from './ext-link'
import { useRouter } from 'next/router'
import styles from '../styles/header.module.css'

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'Home', page: '/' },
  { label: 'Blog', page: '/blog' },
  { label: 'Tag', page: '/tag' },
]

// const defaultOgImageUrl = 'assets/ogimage.png'
const defaultUrl = 'https://blog.izumiz.me'

const Header = ({ path = '', titlePre = '', ogImageUrl = '' }) => {
  const { pathname } = useRouter()

  return (
    <header className={styles.header}>
      <Head>
        <title>{titlePre ? `${titlePre} |` : ''} Izumiz Notion Blog</title>
        <meta name="Izumiz Notion Blog" content="Izumiz Notion Blog" />
        <meta name="og:title" content={`${titlePre} | Izumiz Notion Blog`} />
        <meta
          name="google-site-verification"
          content="gea16KM2TN6crqb32YOrh_H1X9fVovXoW2WgV7axPMw"
        />
        <meta property="og:url" content={`${defaultUrl}${path}`} />
        <meta
          property="og:description"
          content={'Web開発やアプリ開発などの記録、日記をまとめています'}
        />
        <meta name="twitter:site" content="@izumiz-dev" />
        <meta name="twitter:creator" content="@izumiz-dev" />
        <meta property="og:image" content={!ogImageUrl ? null : ogImageUrl} />
        <meta
          name="twitter:card"
          content={!ogImageUrl ? 'summary' : 'summary_large_image'}
        />
        <meta name="twitter:image" content={!ogImageUrl ? null : ogImageUrl} />
        <link rel="canonical" href={`${defaultUrl}${path}`} />
      </Head>
      <ul>
        {navItems.map(({ label, page, link }) => (
          <li key={label}>
            {page ? (
              <Link href={page}>
                <a className={pathname === page ? 'active' : undefined}>
                  {label}
                </a>
              </Link>
            ) : (
              <ExtLink href={link}>{label}</ExtLink>
            )}
          </li>
        ))}
      </ul>
    </header>
  )
}

export default Header
