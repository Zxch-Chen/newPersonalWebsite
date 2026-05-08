/** Shared Substack RSS → JSON posts (serverless route + Vite dev). */
export const SUBSTACK_FEED_URL = 'https://zachchen.substack.com/feed'

export function parseSubstackRSS(xmlText) {
  const posts = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xmlText)) !== null && posts.length < 50) {
    const item = match[1]
    const title = extractTag(item, 'title')
    const link = extractTag(item, 'link')
    const description = extractTag(item, 'description')
    const pubDate = extractTag(item, 'pubDate')

    if (title && link) {
      const cleanDescription = description
        .replace(/<!\[CDATA\[|\]\]>/g, '')
        .replace(/<[^>]*>/g, '')
        .trim()
        .substring(0, 200)

      let formattedDate = 'Recent'
      if (pubDate) {
        try {
          formattedDate = new Date(pubDate).toLocaleDateString('en-US')
        } catch {
          // keep default
        }
      }

      posts.push({
        title: cleanCDATA(title),
        link: cleanCDATA(link),
        description: cleanDescription || 'Read more on Substack',
        pubDate: formattedDate,
      })
    }
  }

  return posts
}

function extractTag(text, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`, 'i')
  const match = text.match(regex)
  return match ? match[1].trim() : ''
}

function cleanCDATA(text) {
  return text.replace(/<!\[CDATA\[|\]\]>/g, '').trim()
}
