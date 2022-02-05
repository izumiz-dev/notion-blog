import Header from '../components/header'
import components from '../components/dynamic'

import blogStyles from '../styles/blog.module.css'
import sharedStyles from '../styles/shared.module.css'
import { textBlock } from '../lib/notion/renderers'

import { getAllBlocksByPageId } from '../lib/notion/client'
import React from 'react'
import Heading from '../components/heading'

export async function getStaticProps() {
  const content = await getAllBlocksByPageId('4afab073b53e4a2caab1ae016e13778f')

  return {
    props: {
      content,
    },
    revalidate: 60,
  }
}

const Index = ({ content = [] }) => {
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
  return (
    <>
      <Header titlePre="Tag" />
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        {/* {JSON.stringify(content, null, 2)} */}
        {content.map((block, blockIdx) => {
          const isLast = blockIdx === content.length - 1
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
                  alt="画像が読み込まれない場合は更新をしてみてください…"
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
              toRender.push(<hr key={block.id} />)

            default:
              if (
                process.env.NODE_ENV !== 'production' &&
                !(
                  block.Type === 'bulleted_list_item' ||
                  block.Type === 'numbered_list_item' ||
                  block.Type === 'divider'
                )
              ) {
                console.log(
                  'blog home: unknown type',
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

export default Index
