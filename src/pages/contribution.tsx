import dynamic from 'next/dynamic'
import Header from '../components/header'
import sharedStyles from '../styles/shared.module.css'

const ReactGitHubCalendar = dynamic(() => import('react-ts-github-calendar'), {
  ssr: false,
})

export default function Profile() {
  return (
    <>
      <Header titlePre="Contribution" />
      <div className={sharedStyles.layout}>
        <h1>Github Contribution</h1>
        <ReactGitHubCalendar responsive userName={'izumiz-dev'} />
      </div>
    </>
  )
}
