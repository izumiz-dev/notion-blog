import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../../components/header'
import PostsLengthZero from '../../components/posts-length-zero'

import blogStyles from '../../styles/blog.module.css'
import sharedStyles from '../../styles/shared.module.css'

import { getBeforeLink, getBlogLink, getDateStr } from '../../lib/blog-helpers'
import { getFirstPost, getPosts } from '../../lib/notion/client'

import Tag from '../../components/tag'
import { textBlock } from '../../lib/notion/renderers'

export async function getStaticProps() {
  const posts = await getPosts(5)
  const firstPost = await getFirstPost()

  return {
    props: {
      posts,
      firstPost,
    },
    revalidate: 60,
  }
}

const Index = ({ posts = [], firstPost }) => {
  const router = useRouter()
  return (
    <>
      <Header titlePre="Blog" />
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        <h1>Web Log from Notion</h1>
        <PostsLengthZero posts={posts} />
        {posts.map((post) => {
          return (
            <div className={blogStyles.postPreview} key={post.Slug}>
              <h3>
                <span className={blogStyles.titleContainer}>
                  <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
                    <a>{post.Title}</a>
                  </Link>
                </span>
              </h3>
              {post.Date && (
                <div className="authors">投稿日: {getDateStr(post.Date)}</div>
              )}
              {post.Tags && (
                <div className="authors">
                  タグ:{' '}
                  {post.Tags.map((tag) => {
                    return <Tag tag={tag} key={`tag-${tag}`} />
                  })}
                </div>
              )}
              <p>
                {(post.preview || []).map((block, idx) =>
                  textBlock(block, true, `${post.Slug}${idx}`)
                )}
              </p>
            </div>
          )
        })}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {firstPost.Date !== posts[posts.length - 1].Date && (
            <div>
              <Link
                href="/blog/before/[date]"
                as={getBeforeLink(posts[posts.length - 1].Date)}
                passHref
              >
                <button className={blogStyles.pageButton}>order 👉</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Index
