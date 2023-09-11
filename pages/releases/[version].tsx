import { allReleases } from 'contentlayer/generated'
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from 'next'
import { useRouter } from 'next/router'
import semverMaxSatisfying from 'semver/ranges/max-satisfying'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { useEffect } from 'react'
import { MDXComponents } from 'components/mdx-components'
import ReleaseLayout from 'layouts/release'

export default function Page({
  doc,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const Component = useMDXComponent(doc.body.code)
  const router = useRouter()

  useEffect(() => {
    if (router.query.version === 'latest') {
      router.replace(`/releases/v${doc.version}`)
    }
  }, [router, doc])

  return (
    <ReleaseLayout hideToc release={doc} frontmatter={doc.frontMatter}>
      <Component components={MDXComponents as any} />
    </ReleaseLayout>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  const paths = [
    ...allReleases.map((doc) => ({
      params: { version: `v${doc.version}` },
    })),
    {
      params: { version: 'latest' },
    },
  ]
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  let versionParam = ctx.params.version

  if (versionParam === 'latest') {
    versionParam = `v${semverMaxSatisfying(
      allReleases.map(({ version }) => version),
      '*',
    )}`
  }
  const doc = allReleases.find(
    ({ version }) => `v${version}` === versionParam,
  )

  doc.frontMatter.title = `v${doc.version} (${doc.codename})`

  return {
    props: { doc },
  }
}
