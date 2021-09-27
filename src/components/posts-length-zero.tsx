import React from 'react'
import blogStyles from '../styles/blog.module.css'

const PostsLengthZero = ({ posts }: { posts: any[] }) => {
  if (posts.length === 0) {
    return (
      <p className={blogStyles.noPosts}>
        エラー発生．
        <br />
        ブラウザでページを更新したら表示されるかも…
      </p>
    )
  } else {
    return null
  }
}

export default PostsLengthZero
