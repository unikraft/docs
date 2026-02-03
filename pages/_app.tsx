import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'
import React, { useEffect } from 'react'
import FontFace from 'components/font-face'
import theme from 'theme'
import '../src/global.css' // TODO(nderjung): Non-relative path.
import 'asciinema-player/dist/bundle/asciinema-player.css'
import 'components/asciinema-player.css'
import { PostHogProvider } from 'posthog-js/react'
import posthog from 'posthog-js'

const App = ({ Component, pageProps }) => {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: '2025-11-30',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      }
    })
  }, [])

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
      <PostHogProvider client={posthog}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </PostHogProvider>
      <FontFace />
    </>
  )
}

export default App
