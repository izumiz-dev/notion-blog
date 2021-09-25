import Link from 'next/link'
import React from 'react'

const Tag = ({ tag }) => {
  return (
    <Link href="/tag/[slug]" as={`/tag/${tag}`} key={tag}>
      <a style={{ color: 'black' }}>
        <span className="post-tag">{tag}</span>
      </a>
    </Link>
  )
}

export default Tag
