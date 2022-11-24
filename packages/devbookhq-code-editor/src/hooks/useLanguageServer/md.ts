import rehypeExternalLinks from 'rehype-external-links'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

export function htmlToElements(html: string) {
  const template = document.createElement('template')
  template.innerHTML = html
  return Array.from(template.content.childNodes)
}

/**
 * We may want to allow explicit specification of the languages that should be highlighted.
 */
async function mdToHtml(md: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .data('settings', { fragment: true })
    .use(rehypeHighlight, {
      detect: true,
    })
    .use(rehypeExternalLinks, {
      rel: 'noopener noreferrer',
      target: '_blank',
    })
    .use(rehypeStringify)
    .process(md)

  return file.toString()
}

export async function mdToElements(md: string) {
  const html = await mdToHtml(md)
  return htmlToElements(html)
}
