import { useRouter } from 'next/router'
import Header from '../../components/header'
import Heading from '../../components/heading'
import components from '../../components/dynamic'
import blogStyles from '../../styles/blog.module.css'
import React, { CSSProperties, useEffect } from 'react'
import { getBlogLink, getDateStr } from '../../lib/blog-helpers'
import Tag from '../../components/tag'
// https://github.com/otoyo/easy-notion-blog/blob/1bd218b40fdf3a31caa1204f86084a0fb15a37ed/src/components/notion-block.tsx
import { LinkPreview } from '@dhaiwat10/react-link-preview'
import {
  getAllBlocksByPageId,
  getAllPosts,
  getPostBySlug,
} from '../../lib/notion/client'
import { textBlock } from '../../lib/notion/renderers'
import TweetEmbed from '../../components/TweetEmbed'
import styles from '../../styles/notion-block.module.css'

import Youtube from 'react-youtube'
// Get the data for each blog post
export async function getStaticProps({ params: { slug } }) {
  const post = await getPostBySlug(slug)

  if (!post) {
    console.log(`Failed to find post for slug: ${slug}`)
    return {
      props: {
        redirect: '/blog',
        preview: false,
      },
      revalidate: 60,
    }
  }
  const blocks = await getAllBlocksByPageId(post.PageId)

  return {
    props: {
      post,
      blocks,
    },
    revalidate: 60,
  }
}

// Return our list of blog posts to prerender
export async function getStaticPaths() {
  const posts = await getAllPosts()
  // we fallback for any unpublished posts to save build time
  // for actually published ones
  return {
    paths: posts.map((post) => getBlogLink(post.Slug)),
    fallback: true,
  }
}

const listTypes = new Set(['bulleted_list', 'numbered_list'])

const RenderPost = ({ post, blocks = [], redirect }) => {
  const router = useRouter()

  let listTagName: string | null = null
  let listLastId: string | null = null
  let listMap: {
    [id: string]: {
      key: string
      isNested?: boolean
      nested: string[]
      children: React.ReactFragment
    }
  } = {}

  useEffect(() => {
    if (redirect && !post) {
      router.replace(redirect)
    }
  }, [redirect, post])

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // if you don't have a post at this point, and are not
  // loading one from fallback then  redirect back to the index
  if (!post) {
    return (
      <div className={blogStyles.post}>
        <p>
          Woops! didn't find that post, redirecting you back to the blog index
        </p>
      </div>
    )
  }

  return (
    <>
      <Header
        titlePre={post.Title}
        path={`/blog/${post.Slug}`}
        ogImageUrl={post.OGImage}
      />
      <div className={blogStyles.post}>
        <h1>{post.Title || ''}</h1>
        {post.Date && (
          <div className="authors">?????????: {getDateStr(post.Date)}</div>
        )}
        {post.Tags && (
          <div className="authors">
            ??????:{' '}
            {post.Tags.map((tag) => {
              return <Tag tag={tag} key={`tag-${tag}`} />
            })}
          </div>
        )}

        <div
          style={{
            margin: '8px auto',
            borderBottom: '4px dotted rgba(0, 0, 0, 0.6)',
          }}
        ></div>
        {blocks.length === 0 && <p>This post has no content</p>}

        {blocks.map((block, blockIdx) => {
          const isLast = blockIdx === blocks.length - 1
          const isList =
            block.Type === 'bulleted_list_item' ||
            block.Type === 'numbered_list_item'
          let toRender = []
          let richText

          if (!!block.RichTexts && block.RichTexts.length > 0) {
            richText = block.RichTexts[0]
          }

          if (isList) {
            listTagName =
              components[block.Type === 'bulleted_list_item' ? 'ul' : 'ol']
            listLastId = `list${block.Id}`

            listMap[block.Id] = {
              key: block.Id,
              nested: [],
              children: textBlock(block, true, block.Id),
            }
          }

          if (listTagName && (isLast || !isList)) {
            toRender.push(
              React.createElement(
                listTagName,
                { key: listLastId! },
                Object.keys(listMap).map((itemId) => {
                  if (listMap[itemId].isNested) return null

                  const createEl = (item) =>
                    React.createElement(
                      components.li || 'ul',
                      { key: item.key },
                      item.children,
                      item.nested.length > 0
                        ? React.createElement(
                            components.ul || 'ul',
                            { key: item + 'sub-list' },
                            item.nested.map((nestedId) =>
                              createEl(listMap[nestedId])
                            )
                          )
                        : null
                    )
                  return createEl(listMap[itemId])
                })
              )
            )
            listMap = {}
            listLastId = null
            listTagName = null
          }

          const renderHeading = (Type: string | React.ComponentType) => {
            if (!!richText) {
              toRender.push(
                <Heading key={block.Id}>
                  <Type key={block.Id}>{textBlock(block, true, block.Id)}</Type>
                </Heading>
              )
            }
          }
          const Embed = ({ block }) => {
            if (/^https:\/\/twitter\.com/.test(block.Embed.Url)) {
              return <TweetEmbed url={block.Embed.Url} />
            } else if (/^https:\/\/gist\.github\.com/.test(block.Embed.Url)) {
              return (
                <LinkPreview
                  url={block.Embed.Url}
                  className={styles.linkPreview}
                />
              )
            }

            return null
          }
          function youtubeParser(url) {
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
            var match = url.match(regExp)
            return match && match[7].length == 11 ? match[7] : false
          }

          const YoutubePlayer = ({ block }) => {
            const videoId = youtubeParser(block.Video.Url)
            if (videoId) {
              return (
                <Youtube videoId={videoId} className={styles.linkPreview} />
              )
            }
            return null
          }

          switch (block.Type) {
            case 'paragraph':
              toRender.push(textBlock(block, false, block.Id))
              break
            case 'heading_1':
              renderHeading('h1')
              break
            case 'heading_2':
              renderHeading('h2')
              break
            case 'heading_3':
              renderHeading('h3')
              break
            case 'image':
              toRender.push(
                <img
                  src={block.Image.File.Url}
                  alt="???????????????????????????????????????????????????????????????????????????"
                />
              )
              if (
                block.Image.Caption.length > 0 &&
                block.Image.Caption[0].Text.Content
              ) {
                toRender.push(
                  <div className={blogStyles.caption}>
                    {block.Image.Caption[0].Text.Content}
                  </div>
                )
              }
              break
            case 'code':
              toRender.push(
                <components.Code key={block.Id} language={block.Language || ''}>
                  {block.Code.Text.map(
                    (richText) => richText.Text.Content
                  ).join('')}
                </components.Code>
              )
              break
            case 'quote':
              toRender.push(
                React.createElement(
                  components.blockquote,
                  { key: block.Id },
                  block.Quote.Text.map(
                    (richText) => richText.Text.Content
                  ).join('')
                )
              )
              break
            case 'divider':
              toRender.push(<hr key={block.id}></hr>)
              break
            case 'bookmark':
              toRender.push(
                <LinkPreview
                  url={block.Bookmark.Url}
                  className={styles.linkPreview}
                  descriptionLength={60}
                />
              )
              break
            case 'link_preview':
              toRender.push(
                <LinkPreview
                  url={block.LinkPreview.Url}
                  className={styles.linkPreview}
                  descriptionLength={60}
                />
              )
              break
            case 'embed':
              toRender.push(<Embed block={block} />)
              break
            case 'video':
              toRender.push(<YoutubePlayer block={block} />)
              break
            default:
              if (
                process.env.NODE_ENV !== 'production' &&
                !(
                  block.Type === 'bulleted_list_item' ||
                  block.Type === 'numbered_list_item' ||
                  block.Type === 'embed'
                )
              ) {
                console.log(
                  'blog/[slug].tsx: unknown type',
                  block.Type,
                  JSON.stringify(block, null, 2)
                )
              }
              break
          }
          return toRender
        })}
      </div>
    </>
  )
}

export default RenderPost
