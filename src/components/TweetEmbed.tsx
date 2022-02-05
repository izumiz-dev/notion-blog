// https://github.com/otoyo/easy-notion-blog/blob/1bd218b40fdf3a31caa1204f86084a0fb15a37ed/src/components/tweet-embed.tsx

import { TwitterTweetEmbed } from 'react-twitter-embed'

const TweetEmbed = ({ url }) => {
  let matched
  try {
    matched = new URL(url).pathname.match(/\/(\d+)$/)
  } catch (error) {
    console.log(error)
    return null
  }

  if (!matched) {
    return null
  }

  return <TwitterTweetEmbed tweetId={matched[1]} />
}

export default TweetEmbed
