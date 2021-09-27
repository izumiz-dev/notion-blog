export const getBlogLink = (slug: string) => {
  return `/blog/${slug}`
}

export const getTagLink = (slug: string) => {
  return `/tag/${slug}`
}

export const getDateStr = (date) => {
  return new Date(date).toLocaleString('ja-JP', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })
}

export const postIsPublished = (post: any) => {
  return post.Published === 'Yes'
}

export const normalizeSlug = (slug) => {
  if (typeof slug !== 'string') return slug

  let startingSlash = slug.startsWith('/')
  let endingSlash = slug.endsWith('/')

  if (startingSlash) {
    slug = slug.substr(1)
  }
  if (endingSlash) {
    slug = slug.substr(0, slug.length - 1)
  }
  return startingSlash || endingSlash ? normalizeSlug(slug) : slug
}

export const sortPosts = (
  posts: any[],
  orderBy: string[] | string = 'desc',
  sortBy: 'date'
) => {
  const sorted = posts.sort((a, b) => {
    if (orderBy === 'asc') {
      return a.Date - b.Date
    } else if (orderBy === 'desc') {
      return b.Date - a.Date
    }
  })
  return sorted
}
