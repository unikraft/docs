import {
  ComputedFields,
  defineDocumentType,
  defineNestedType,
  makeSource,
} from 'contentlayer/source-files'
import remarkEmoji from 'remark-emoji'
import remarkGfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import siteConfig from './configs/site-config.json'
import { getTableOfContents } from './src/utils/get-table-of-contents'
import { rehypeMdxCodeMeta } from './src/utils/rehype-code-meta'

const computedFields: ComputedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
}

const Guides = defineDocumentType(() => ({
  name: 'Guide',
  filePathPattern: 'guides/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' } },
    publishedDate: { type: 'string' },
    authors: { type: 'list', of: { type: 'string' } },
    category: { type: 'string' },
    image: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    frontMatter: {
      type: 'json',
      resolve: (doc) => ({
        publishedDate: {
          raw: doc.publishedDate,
          iso: new Date(doc.publishedDate).toISOString(),
          text: new Date(doc.publishedDate).toDateString(),
        },
        title: doc.title,
        description: doc.description,
        tags: doc.tags,
        image: doc.image,
        authors: doc.authors,
        slug: `/${doc._raw.flattenedPath}`,
        editUrl: `${siteConfig.repo.editUrl}/${doc._id}`,
        headings: getTableOfContents(doc.body.raw),
      }),
    },
  },
}))

const Blogs = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    authors: { type: 'list', of: { type: 'string' } },
    tags: { type: 'list', of: { type: 'string' } },
    publishedDate: { type: 'string' },
    image: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    frontMatter: {
      type: 'json',
      resolve: (doc) => ({
        publishedDate: {
          raw: doc.publishedDate,
          iso: new Date(doc.publishedDate).toISOString(),
          text: new Date(doc.publishedDate).toDateString(),
        },
        image: doc.image,
        authors: doc.authors,
        tags: doc.tags,
        title: doc.title,
        description: doc.description,
        slug: `/${doc._raw.flattenedPath}`,
        editUrl: `${siteConfig.repo.editUrl}/${doc._id}`,
      }),
    },
  },
}))

const Docs = defineDocumentType(() => ({
  name: 'Docs',
  filePathPattern: 'docs/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string' },
    description: { type: 'string' },
    id: { type: 'string' },
    author: { type: 'string' },
    video: { type: 'string' },
    category: { type: 'string' },
    aria: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    frontMatter: {
      type: 'json',
      resolve: (doc) => ({
        title: doc.title,
        description: doc.description,
        slug: `/${doc._raw.flattenedPath}`,
        editUrl: `${siteConfig.repo.editUrl}/${doc._id}`,
        headings: getTableOfContents(doc.body.raw),
      }),
    },
  },
}))

const Host = defineNestedType(() => ({
  name: 'Host',
  fields: {
    name: { type: 'string', required: true },
    url: { type: 'string' },
  },
}))

const Hackathons = defineDocumentType(() => ({
  name: 'Hackathons',
  filePathPattern: 'hackathons/**/index.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    slug: { type: 'string' },
    image: { type: 'string' },
    startDate: { type: 'date' },
    registerForm: { type: 'string' },
    address: { type: 'list', of: { type: 'string' } },
    map: { type: 'string' },
    partners: { type: 'list', of: Host },
    hosts: { type: 'list', of: Host },
  },
  computedFields: {
    ...computedFields,
    frontMatter: {
      type: 'json',
      resolve: (doc) => ({
        title: doc.title,
        description: doc.description,
        slug: `/${doc._raw.flattenedPath}`,
        image: doc.image,
        headings: getTableOfContents(doc.body.raw),
      }),
    },
  },
}))

const Community = defineDocumentType(() => ({
  name: 'Community',
  filePathPattern: 'community/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' } },
    author: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    frontMatter: {
      type: 'json',
      resolve: (doc) => ({
        title: doc.title,
        description: doc.description,
        tags: doc.tags,
        author: doc.author,
        slug: `/${doc._raw.flattenedPath}`,
        editUrl: `${siteConfig.repo.editUrl}/${doc._id}`,
        headings: getTableOfContents(doc.body.raw),
      }),
    },
  },
}))

const Releases = defineDocumentType(() => ({
  name: 'Releases',
  filePathPattern: 'releases/*.mdx',
  contentType: 'mdx',
  fields: {
    version: { type: 'string', required: true },
    codename: { type: 'string', required: true },
    commit: { type: 'string', required: true },
    releaseDate: { type: 'string', required: true },
    changelog: { type: 'string' },
    blogPost: { type: 'string' },
  },
  computedFields: {
    frontMatter: {
      type: 'json',
      resolve: (doc) => ({
        slug: `/${doc._raw.flattenedPath}`,
        headings: getTableOfContents(doc.body.raw),
        version: doc.version,
        codename: doc.codename,
        commit: doc.commit,
        releaseDate: doc.releaseDate,
        changelog: doc.changelog,
        blogPost: doc.blogPost,
      }),
    },
  },
}))

const contentLayerConfig = makeSource({
  contentDirPath: 'content',
  documentTypes: [Docs, Guides, Community, Releases, Blogs, Hackathons],
  mdx: {
    rehypePlugins: [rehypeMdxCodeMeta],
    remarkPlugins: [remarkSlug, remarkGfm, remarkEmoji],
  },
})

export default contentLayerConfig
