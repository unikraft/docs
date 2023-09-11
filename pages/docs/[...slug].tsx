import { MDXComponents } from 'components/mdx-components'
import { allDocs } from 'contentlayer/generated'
import MDXLayout from 'layouts/mdx'
import { GetStaticPaths, InferGetStaticPropsType } from 'next'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { toArray } from 'utils/js-utils'

export default function Page({
  doc,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const Component = useMDXComponent(doc.body.code)
  return (
    <MDXLayout frontmatter={doc.frontMatter}>
      <Component components={MDXComponents as any} />
    </MDXLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const docs = allDocs
    .map((d) => d._id.replace('docs/', '').replace('.mdx', '').split('/'))
    .map((id) => {
      if (id[id.length-1] === 'index') {
        id = id.slice(0, -1)
      }
      return { params: { slug: id } }
    })

  return { paths: docs, fallback: false }
}

export const getStaticProps = async (ctx) => {
  const params = toArray(ctx.params.slug)
  const doc = allDocs.find((d) =>  d.slug == '/docs/' + params.join('/'))
  return { props: { doc } }
}
