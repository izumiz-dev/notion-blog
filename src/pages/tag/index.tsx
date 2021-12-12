import Header from '../../components/header'
import PostsLengthZero from '../../components/posts-length-zero'

import blogStyles from '../../styles/blog.module.css'
import sharedStyles from '../../styles/shared.module.css'

import Tag from '../../components/tag'
import { getAllTags } from '../../lib/notion/client'

export async function getStaticProps() {
  const tags = await getAllTags()

  return {
    props: {
      tags,
    },
    revalidate: 60,
  }
}

const Index = ({ tags = [] }) => {
  return (
    <>
      <Header titlePre="Tag" />
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        <h1>タグ一覧</h1>
      </div>
      <PostsLengthZero posts={tags} />
      <div style={{ textAlign: 'center' }}>
        {tags.map((tag) => (
          <div className="tag-div" key={`div${tag}`}>
            <Tag tag={tag} key={`tag-${tag}`} />
          </div>
        ))}
      </div>
    </>
  )
}

export default Index
