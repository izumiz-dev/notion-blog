import Link from 'next/link'
import React from 'react'
import Header from '../../components/header'
import PostsLengthZero from '../../components/posts-length-zero'

import { getBlogLink, getTagLink } from '../../lib/blog-helpers'
import { getPostsByTag, getAllTags } from '../../lib/notion/client'
import blogStyles from '../../styles/blog.module.css'
import sharedStyles from '../../styles/shared.module.css'

import Tag from '../../components/tag'
import { textBlock } from '../../lib/notion/renderers'

// Return our list of blog posts to prerender
export async function getStaticPaths() {
  const tags = await getAllTags()

  return {
    paths: tags.map((tag) => getTagLink(tag)),
    fallback: true,
  }
}

// Get the data for each blog post
export async function getStaticProps({ params: { tag } }) {
  const posts = await getPostsByTag(tag)

  return {
    props: {
      posts,
      tag: tag,
    },
    revalidate: 60,
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
                  <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
                    <a>{post.Title}</a>
                  </Link>
                </span>
              </h3>
              {post.Date && <div className="authors">投稿日: {post.Date}</div>}
              {post.Tags && (
                <div className="authors">
                  タグ:{' '}
                  {post.Tags.map((tag) => {
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
