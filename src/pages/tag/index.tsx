import Header from '../../components/header'

import blogStyles from '../../styles/blog.module.css'
import sharedStyles from '../../styles/shared.module.css'

import { postIsPublished } from '../../lib/blog-helpers'
import getNotionUsers from '../../lib/notion/getNotionUsers'
import getBlogIndex from '../../lib/notion/getBlogIndex'
import Tag from '../../components/tag'

export async function getStaticProps({ preview }) {
  const allTags: string[] = []
  const postsTable = await getBlogIndex()

  const authorsToGet: Set<string> = new Set()
  const posts: any[] = Object.keys(postsTable)
    .map((slug) => {
      const post = postsTable[slug]
      // remove draft posts in production
      if (!preview && !postIsPublished(post)) {
        return null
      }
      post.Authors = post.Authors || []
      for (const author of post.Authors) {
        authorsToGet.add(author)
      }
      return post
    })
    .filter(Boolean)

  posts.forEach((post) => {
    post.Tags.split(',').forEach((tag) => {
      if (!allTags.includes(tag)) {
        allTags.push(tag)
      }
    })
  })

  const { users } = await getNotionUsers([...authorsToGet])

  posts.map((post) => {
    post.Authors = post.Authors.map((id) => users[id].full_name)
  })

  return {
    props: {
      tags: allTags,
    },
    revalidate: 10,
  }
}

const Index = ({ tags = [] }) => {
  return (
    <>
      <Header titlePre="Tag" />
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        <h1>タグ一覧</h1>
      </div>
      <div style={{ textAlign: 'center' }}>
        {tags.map((tag) => (
          <div key={`div${tag}`}>
            <Tag tag={tag} key={`tag-${tag}`} />
          </div>
        ))}
      </div>
    </>
  )
}

export default Index
