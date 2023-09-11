import { Avatar, Box, HStack, Text } from '@chakra-ui/react'
import * as React from 'react'
import MDXLayout from './mdx'

interface BlogLayoutProps {
  frontmatter: any
  children: React.ReactNode
}

export default function BlogLayout(props: BlogLayoutProps) {
  const { frontmatter, children } = props

  if (!frontmatter) return <></>
  const { publishedDate = {}, authorData: data = {} } = frontmatter

  return (
    <MDXLayout
      frontmatter={frontmatter}
      hideToc={false}
    >
      {children}
    </MDXLayout>
  )
}
