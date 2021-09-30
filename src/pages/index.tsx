import dynamic from 'next/dynamic'
import Header from '../components/header'
import sharedStyles from '../styles/shared.module.css'

const ReactGitHubCalendar = dynamic(() => import('react-ts-github-calendar'), {
  ssr: false,
})
export default function Index() {
  return (
    <>
      <Header titlePre="Home" />
      <div className={sharedStyles.layout}>
        <h1>Blog Home</h1>
        <div style={{ textAlign: 'center' }}>
          <p>
            <s>たまにバグります…</s>
            <br />
            ISRをやめてSSGにしました.
          </p>
          <a href="https://blog.izumiz.me/blog/renewal-blog">
            このブログはNotion-blogで作成しています
          </a>
        </div>
        <h2>進捗メーター</h2>
        <div style={{ padding: '0 20%' }}>
          <ReactGitHubCalendar
            // tooltips
            responsive
            global_stats={false}
            userName={'izumiz-dev'}
          />
        </div>
      </div>
    </>
  )
}
