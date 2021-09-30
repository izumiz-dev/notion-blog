import dynamic from 'next/dynamic'

import Header from '../components/header'
import ExtLink from '../components/ext-link'

import sharedStyles from '../styles/shared.module.css'
import contactStyles from '../styles/contact.module.css'

import GitHub from '../components/svgs/github'
import Twitter from '../components/svgs/twitter'

const ReactGitHubCalendar = dynamic(() => import('react-ts-github-calendar'), {
  ssr: false,
})

const contacts = [
  {
    Comp: Twitter,
    alt: 'twitter icon',
    link: 'https://twitter.com/izumiz_dev',
  },
  {
    Comp: GitHub,
    alt: 'github icon',
    link: 'https://github.com/izumiz-dev',
  },
]

export default function Profile() {
  return (
    <>
      <Header titlePre="Contact" />
      <div className={sharedStyles.layout}>
        <h1 style={{ marginTop: 0 }}>Contact</h1>

        <div className={contactStyles.name}>izumiz</div>

        <div className={contactStyles.links}>
          {contacts.map(({ Comp, link, alt }) => {
            return (
              <ExtLink key={link} href={link} aria-label={alt}>
                <Comp height={32} />
              </ExtLink>
            )
          })}
        </div>
        <h2>Contribution</h2>
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
