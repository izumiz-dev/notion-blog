import Link from 'next/link'
import React from 'react'
import Header from '../../components/header'
import PostsLengthZero from '../../components/posts-length-zero'

import { getBlogLink, getDateStr, getTagLink } from '../../lib/blog-helpers'
import getBlogIndex from '../../lib/notion/getBlogIndex'
import { textBlock } from '../../lib/notion/renderers'

import blogStyles from '../../styles/blog.module.css'
import sharedStyles from '../../styles/shared.module.css'

import Tag from '../../components/tag'

// Return our list of blog posts to prerender
export async function getStaticPaths() {
  const postsTable = await getBlogIndex(false)

  const aggregated = []

  Object.keys(postsTable).map((slug) => {
    const post = postsTable[slug]
    if (post.Published === 'Yes') {
      post.Tags.split(',').forEach((tag) => {
        aggregated.push(tag)
      })
    }
  })

  const paths = Array.from(new Set(aggregated))

  return {
    paths: paths.map((path) => getTagLink(path)),
    fallback: true,
  }
}

// Get the data for each blog post
export async function getStaticProps({ params: { slug }, preview }) {
  // load the postsTable so that we can get the page's ID
  const postsTable = await getBlogIndex(false)

  const matchedPosts = []

  Object.keys(postsTable).forEach((key) => {
    const post = postsTable[key]
    if (post.Tags.split(',').includes(slug)) {
      matchedPosts.push(post)
    }
  })

  return {
    props: {
      posts: matchedPosts,
      tag: slug,
    },
    revalidate: false,
  }
}

const TagIndex = ({ posts = [], tag }) => {
  return (
    <>
      <Header titlePre="Tag" />
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        <h1>{`${tag}の記事一覧`}</h1>
        <PostsLengthZero posts={posts} />
        {posts.map((post) => {
          return (
            <div className={blogStyles.postPreview} key={post.Slug}>
              <h3>
                <span className={blogStyles.titleContainer}>
                  {!post.Published && (
                    <span className={blogStyles.draftBadge}>Draft</span>
                  )}
                  <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
                    <a>{post.Page}</a>
                  </Link>
                </span>
              </h3>
              {post.Date && (
                <div className="authors">投稿日: {getDateStr(post.Date)}</div>
              )}
              {post.Tags && (
                <div className="authors">
                  タグ:{' '}
                  {post.Tags.split(',').map((tag) => {
                    return <Tag tag={tag} />
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
      </div>
    </>
  )
}

export default TagIndex
