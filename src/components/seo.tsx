import { NextSeo, NextSeoProps } from 'next-seo'
import React from 'react'
import siteConfig from 'configs/site-config.json'

export type SEOProps = Pick<NextSeoProps, 'title' | 'description' | 'openGraph'>

const SEO = ({ title, description, openGraph }: SEOProps) => {
  if (!openGraph) {
    openGraph = {
      title,
      description,
    }
  }

  if (openGraph && (!openGraph.images || openGraph.images.length === 0)) {
    openGraph.images = [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ]
  }

  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={openGraph}
      titleTemplate={siteConfig.seo.titleTemplate}
    />
  )
}

export default SEO
