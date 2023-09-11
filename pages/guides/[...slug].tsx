import { MDXComponents } from 'components/mdx-components'
import { allGuides } from 'contentlayer/generated'
import MDXTutorialLayout from 'layouts/guide'
import { GetStaticPaths, InferGetStaticPropsType } from 'next'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { toArray } from 'utils/js-utils'

export default function Page({
  guide,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const Component = useMDXComponent(guide.body.code)
  return (
    <MDXTutorialLayout frontmatter={guide.frontMatter}>
      <Component components={MDXComponents as any} />
    </MDXTutorialLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const guides = allGuides
    .map((t) =>
      t._id.replace('guides/', '').replace('.mdx', '').replace('/index', ''),
    )
    .map((id) => ({ params: { slug: [id.replace('guides/', '')] } }))

  return { paths: guides, fallback: false }
}

export const getStaticProps = async (ctx) => {
  const params = Array.isArray(ctx.params.slug)
    ? ctx.params.slug
    : [ctx.params.slug]

  const guide = allGuides.find((guide) => guide._id.includes(params.join('/')))

  return { props: { guide } }
}
