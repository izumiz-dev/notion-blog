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
        <h1>Blog Home</h1>
        <div style={{ textAlign: 'center' }}>
          <p>
            <s>たまにバグります…</s>
            <br />
            ISRをやめてSSGにしました.
          </p>
        </div>
        <h2 style={{ color: '#000' }}>Contribution</h2>
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
