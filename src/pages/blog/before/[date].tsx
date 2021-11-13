import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { NUMBER_OF_POSTS_PER_PAGE } from '../../../lib/notion/server-constants'
import Header from '../../../components/header'
import blogStyles from '../../../styles/blog.module.css'
import sharedStyles from '../../../styles/shared.module.css'

import {
  getBlogLink,
  getBeforeLink,
  getDateStr,
} from '../../../lib/blog-helpers'
import {
  getPosts,
  getRankedPosts,
  getPostsBefore,
  getFirstPost,
  getAllTags,
} from '../../../lib/notion/client'
import PostsLengthZero from '../../../components/posts-length-zero'
import { textBlock } from '../../../lib/notion/renderers'
import Tag from '../../../components/tag'

export async function getStaticProps({ params: { date } }) {
  if (!Date.parse(date) || !/\d{4}-\d{2}-\d{2}/.test(date)) {
    return { notFound: true }
  }

  const posts = await getPostsBefore(date, NUMBER_OF_POSTS_PER_PAGE)
  const firstPost = await getFirstPost()
  const rankedPosts = await getRankedPosts()
  const tags = await getAllTags()

  return {
    props: {
      date,
      posts,
      firstPost,
      rankedPosts,
      tags,
    },
    revalidate: 3600,
  }
}

export async function getStaticPaths() {
  const posts = await getPosts(5)
  const path = getBeforeLink(posts[posts.length - 1].Date)

  // only latest 1 page will be returned in order to reduce build time
  return {
    paths: [path],
    fallback: 'blocking',
  }
}

const RenderPostsBeforeDate = ({ date, posts = [], firstPost, redirect }) => {
  const router = useRouter()

  useEffect(() => {
    if (redirect && !posts) {
      router.replace(redirect)
    }
  }, [router, redirect, posts])

  // if you don't have a post at this point, and are not
  // loading one from fallback then  redirect back to the index
  if (!posts) {
    return (
      <div className={blogStyles.post}>
        <p>
          Woops! did not find the posts, redirecting you back to the blog index
        </p>
      </div>
    )
  }

  return (
    <>
      <Header path={getBeforeLink(date)} titlePre={`${date}より前の記事`} />
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
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
          <div>
            <a onClick={() => router.back()}>
              <button className={blogStyles.pageButton}>👈 newer</button>
            </a>
          </div>
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

export default RenderPostsBeforeDate
