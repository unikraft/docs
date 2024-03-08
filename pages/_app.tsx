import { ChakraProvider } from '@chakra-ui/react'
import { DefaultSeo } from 'next-seo'
import Head from 'next/head'
import React from 'react'
import FontFace from 'components/font-face'
import theme from 'theme'
import { getSeo } from 'utils/seo'
import '../src/global.css' // TODO(nderjung): Non-relative path.
import 'asciinema-player/dist/bundle/asciinema-player.css'
import 'components/asciinema-player.css'

const App = ({ Component, pageProps }) => {
  const seo = getSeo()

  return (
    <>
      <Head>
        <meta content='IE=edge' httpEquiv='X-UA-Compatible' />
        <meta content='width=device-width, initial-scale=1' name='viewport' />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://static.cloudflareinsights.com' />
        <meta name='theme-color' content='#032b59' />
        <meta name="msapplication-TileColor" content="#032b59" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <DefaultSeo {...seo} />
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
      <FontFace />
    </>
  )
}

export default App
