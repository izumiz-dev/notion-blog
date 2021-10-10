import dynamic from 'next/dynamic'
import Header from '../components/header'
import sharedStyles from '../styles/shared.module.css'
import contactStyles from '../styles/contact.module.css'

const ReactGitHubCalendar = dynamic(() => import('react-ts-github-calendar'), {
  ssr: false,
})
export default function Index() {
  return (
    <>
      <Header titlePre="Home" />
      <div className={sharedStyles.layout}>
        <h1>About</h1>
        <div className={sharedStyles.page}>
          <p>
            主にJavaScript，TypeScript，
            Reactなどを使いWebアプリなどを作成しています．
            その中で役に立ったことなどをブログ記事として残しています．
          </p>
          <p>また，どうでもいいような日記も更新していくつもりです．</p>
          <p>
            本ブログは，
            <a href="https://github.com/ijjk/notion-blog">Notion-blog</a>
            をもとに作成し，Notionからの記事の取得は
            <a href="https://developers.notion.com/">Notion API</a>
            を利用しています．
          </p>
        </div>
        <h2 style={{ color: '#000' }}>Contribution</h2>
        <div style={{ textAlign: 'center' }}>
          Github コントリビューションの状況です． いつでも監視いただけます．
        </div>
        <div className={contactStyles.contribution}>
          <ReactGitHubCalendar
            responsive
            userName={'izumiz-dev'}
            global_stats={false}
          />
        </div>
      </div>
    </>
  )
}
