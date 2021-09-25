import Header from '../components/header'
// import ExtLink from '../components/ext-link'
// import Features from '../components/features'
import sharedStyles from '../styles/shared.module.css'

export default function Index() {
  return (
    <>
      <Header titlePre="Home" />
      <div className={sharedStyles.layout}>
        <h1>Web Log from Notion</h1>
        <div style={{ textAlign: 'center' }}>
          <p>たまにバグります…</p>
          <a href="https://blog.izumiz.me/blog/renewal-blog">
            NotionとNext.jsで作成してます．
          </a>
        </div>
      </div>
    </>
  )
}
