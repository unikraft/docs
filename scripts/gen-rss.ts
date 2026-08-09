import {
  parseMarkdownString,
  posixPath,
} from '@docusaurus/utils'
import { Feed } from 'feed'
import fs from 'fs'
import path from 'path'
import shell from 'shelljs'
import siteConfig from '../configs/site-config.json'

const websiteRoot = 'content'
const blogRoot = path.join(websiteRoot, 'blog')
const siteUrl = siteConfig.seo.siteUrl

async function getMDXMeta(file: string) {
  const markdownString = fs.readFileSync(file).toString()
  const { frontMatter: _frontMatter } = await parseMarkdownString(markdownString)
  const frontMatter = _frontMatter as any
  
  const filePath = posixPath(file)
  const slug = filePath
    .replace(posixPath(path.join(process.cwd(), websiteRoot)), '')
    .replace('.mdx', '')

  return {
    title: frontMatter.title,
    description: frontMatter.description,
    date: new Date(frontMatter.publishedDate),
    authors: frontMatter.authors || [],
    url: `${siteUrl}${slug}`,
    guid: slug,
  }
}

async function genRSS() {
  const files = shell
    .ls('-R', blogRoot)
    .map((file) => path.join(process.cwd(), blogRoot, file))
    .filter((file) => file.endsWith('.mdx'))

  const feed = new Feed({
    title: siteConfig.seo.title + ' Blog',
    description: siteConfig.seo.description,
    id: siteUrl + '/blog',
    link: siteUrl + '/blog',
    language: 'en',
    image: `${siteUrl}/logo.png`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: siteConfig.copyright.replace('{{date}}', new Date().getFullYear().toString()),
    generator: 'UniKernels RSS Generator',
    feedLinks: {
      rss2: `${siteUrl}/blog/rss.xml`,
      atom: `${siteUrl}/blog/atom.xml`,
    },
    author: {
      name: 'UniKernels',
      link: siteUrl,
    },
  })

  const posts = []
  for (const file of files) {
    try {
      const meta = await getMDXMeta(file)
      posts.push(meta)
    } catch (e) {
      console.error(`Error parsing ${file}:`, e)
    }
  }

  // Sort posts by date descending
  posts.sort((a, b) => b.date.getTime() - a.date.getTime())

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: post.url,
      link: post.url,
      description: post.description,
      date: post.date,
      author: post.authors.map((name: string) => ({ name })),
    })
  })

  // Also include the feeds directly in the public/blog folder
  const publicBlogDir = path.join(process.cwd(), 'public', 'blog')
  if (!fs.existsSync(publicBlogDir)) {
    shell.mkdir('-p', publicBlogDir)
  }

  fs.writeFileSync(path.join(publicBlogDir, 'rss.xml'), feed.rss2())
  fs.writeFileSync(path.join(publicBlogDir, 'atom.xml'), feed.atom1())
  fs.writeFileSync(path.join(publicBlogDir, 'feed.json'), feed.json1())

  // Additionally, to support /blog/rss and /blog/atom (without extension),
  // we can create those files without extensions in the public folder.
  // Next.js will serve them from public.
  fs.writeFileSync(path.join(publicBlogDir, 'rss'), feed.rss2())
  fs.writeFileSync(path.join(publicBlogDir, 'atom'), feed.atom1())

  console.log('RSS, Atom and JSON feeds generated successfully! ✅')
}

genRSS()
