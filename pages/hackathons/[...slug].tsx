import { MDXComponents } from 'components/mdx-components'
import { allHackathons } from 'contentlayer/generated'
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
  const hackathons = allHackathons
    .map((d) => d._id.replace('hackathons/', '').replace('index.mdx', '').split('/'))
    .map((id) => {
      if (id[id.length-1] === 'index') {
        id = id.slice(0, -1)
      }
      return { params: { slug: id } }
    })

  return { paths: hackathons, fallback: false }
}

export const getStaticProps = async (ctx) => {
  const params = toArray(ctx.params.slug)
  const doc = allHackathons.find((d) =>  d.slug == '/hackathons/' + params.join('/'))
  return { props: { doc } }
}
