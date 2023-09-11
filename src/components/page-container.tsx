import {
  Badge,
  Box,
  Flex,
  Grid,
  Image,
  GridItem,
  chakra,
} from '@chakra-ui/react'
import { SkipNavContent, SkipNavLink } from '@chakra-ui/skip-nav'
import { useRouter } from 'next/router'
import * as React from 'react'
import EditPageLink from 'components/edit-page-button'
import Footer from 'components/footer'
import Header from 'components/header'
import SEO from 'components/seo'
import TableOfContent from 'components/table-of-content'
import { convertBackticksToInlineCode } from 'utils/convert-backticks-to-inline-code'
import { t } from 'utils/i18n'
import { FrontmatterHeading } from 'src/types/frontmatter'
// import { AdBanner } from './chakra-pro/ad-banner'

function useHeadingFocusOnRouteChange() {
  const router = useRouter()

  React.useEffect(() => {
    const onRouteChange = () => {
      const [heading] = Array.from(document.getElementsByTagName('h1'))
      heading?.focus()
    }
    router.events.on('routeChangeComplete', onRouteChange)
    return () => {
      router.events.off('routeChangeComplete', onRouteChange)
    }
  }, [router.events])
}

interface PageContainerProps {
  frontmatter: {
    slug?: string
    title: string
    image?: string
    description?: string
    editUrl?: string
    version?: string
    headings?: FrontmatterHeading[]
  }
  hideToc?: boolean
  maxWidth?: string
  children: React.ReactNode
  leftSidebar?: React.ReactElement
  rightSidebar?: React.ReactElement
  pagination?: React.ReactElement
}

function PageContainer(props: PageContainerProps) {
  const {
    frontmatter,
    children,
    leftSidebar,
    rightSidebar,
    pagination,
    hideToc,
    maxWidth = '48rem',
  } = props

  useHeadingFocusOnRouteChange()

  if (!frontmatter) return <></>

  const {
    title,
    description,
    editUrl,
    image,
    headings = [],
  } = frontmatter

  return (
    <>
      <SEO title={title} description={description} />
      <Grid
        w='100vw'
        h='100vh'
        gridTemplateColumns={'1fr'}
        gridTemplateRows={'auto 1fr'}
        templateAreas={`"header"
                        "body"`}
      >
        <GridItem
          area={'header'}
        >
          <Header />
        </GridItem>
        <GridItem
          area={'body'}
          overflow='auto'
          display={'grid'}
          gridTemplateColumns={'1fr'}
          gridTemplateRows={'1fr auto'}
          gridTemplateAreas={`"main"
                              "footer"`}
        >
          <GridItem
            area={'main'}
            display={'flex'}
          >
            <Grid
              templateAreas={{
                base: `"content"`,
                lg: `"nav content"`
              }}
              gridTemplateRows={'1fr'}
              gridTemplateColumns={{
                base: '1fr',
                lg: '280px 1fr',
              }}
              w={{
                base: '100vw',
                '2xl': '8xl',
              }}
              mx='auto'
            >
              <GridItem area={'nav'}>
                {leftSidebar || null}
              </GridItem>
              <GridItem
                area={'content'}
                bg='white'
                _dark={{
                  bg: 'transparent',
                  borderColor: 'transparent'
                }}
                w={{
                  base: '100vw',
                  lg: '100%'
                }}
                display='flex'
                borderLeftWidth={'1px'}
                borderRightWidth={'1px'}
                justifyContent={'space-between'}
              >
                <Box
                  w={{
                    base: '100%',
                    '2xl': '3xl',
                  }}
                  maxW={{
                    base: '3xl',
                    lg: '2xl',
                    '2xl': '3xl',
                  }}
                  p={{ base: '4', sm: '6', xl: '8' }}
                >
                  <Box>
                    {image && (
                      <Image
                        src={image}
                        borderRadius={'md'}
                        mb='8'
                        />
                    )}
                    <chakra.h1 tabIndex={-1} outline={0} apply='mdx.h1' mt='0'>
                      {convertBackticksToInlineCode(title)}
                    </chakra.h1>
                    <chakra.h3 lineHeight='tall' tabIndex={-1} outline={0} apply='mdx.h3' mt='6' fontWeight='medium'>
                      {convertBackticksToInlineCode(description)}
                    </chakra.h3>
                    {children}
                    <Box
                      mt='40px'
                      pt='30px'
                      borderTop={'solid 1px'}
                      borderColor={'slate.300'}
                      _dark={{
                        borderColor: 'gray.700',
                      }}
                    >
                      <Box>{editUrl && <EditPageLink href={editUrl} />}</Box>
                      {pagination || null}
                    </Box>
                  </Box>
                </Box>
                {!hideToc && (
                  <TableOfContent
                    visibility={headings.length === 0 ? 'hidden' : 'initial'}
                    headings={headings}
                  />
                )}
                {rightSidebar}
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem area={'footer'}>
            <Footer />
          </GridItem>
        </GridItem>
      </Grid>
    </>
  )
}

export default PageContainer
