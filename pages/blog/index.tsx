import { compareDesc } from 'date-fns'
import {
  Heading,
  VStack,
  Box,
  Tag,
  Link,
  SimpleGrid,
  LinkOverlay,
  Grid,
  LinkBox,
  Flex,
  GridItem,
  HStack,
  Text
} from '@chakra-ui/react'
import {
  FaArrowRight,
  FaLaptopCode,
} from 'react-icons/fa'
import { RiPresentationFill } from 'react-icons/ri'
import { MdOutlineMenuBook } from 'react-icons/md'
import { GrCertificate } from 'react-icons/gr'
import { IoCalendarSharp } from 'react-icons/io5'
import { allBlogs } from 'contentlayer/generated'
import Container from 'components/container'
import Footer from 'components/footer'
import Header from 'components/header'
import SEO from 'components/seo'
import { convertBackticksToInlineCode } from 'utils/convert-backticks-to-inline-code'
import { Blog as IBlog } from 'contentlayer/generated'
import { relativeTimeFromDates } from 'utils/to-relative-time';
import { IconType } from 'react-icons/lib'
import { ReactElement } from 'react'
import { DiscordCard } from 'components/discord-card'
import { KraftCloudAd } from 'components/kraftcloud-ad'

const BlogTags = (props: any) => {
  const { marginTop = 0, tags } = props

  return (
    <HStack spacing={2} marginTop={marginTop}>
      {tags.map((tag) => {
        return (
          <Tag
            fontFamily={'mono'}
            size={'sm'}
            variant="solid"
            colorScheme="orange"
            key={tag}
            rounded={'sm'}
          >
            #{tag}
          </Tag>
        )
      })}
    </HStack>
  )
}

interface ResourceLinkProps {
  icon: ReactElement<IconType>
  url: string
  title: string
}

const ResourceLink = (props: ResourceLinkProps) => {
  const { icon, url, title } = props

  return (
    <Link
      borderWidth='1px'
      borderColor={'rgba(0,0,0,.1)'}
      rounded='md'
      bg='gray.50'
      w={'100%'}
      display={'flex'}
      transform='auto'
      transition='all 0.1s ease-in-out'
      _hover={{
        translateY: '-2px',
        bg: 'gray.100',
        textDecoration: 'underline',
      }}
      _dark={{
        bg: 'slate.900',
        borderColor: 'slate.600'
      }}
      p={5}
      href={url}
    >
      <Box display={'inline-block'} mt={1} mr={3}>
        {icon}
      </Box>
      <Flex
        w={'100%'}
        justifyContent={'space-between'}
      >
        <Text fontWeight={'medium'}>{title}</Text>
        <Box display={'inline-block'} mt={1}>
          <FaArrowRight />
        </Box>
      </Flex>
    </Link>
  )
}

const resources: ResourceLinkProps[] = [
  {
    icon: <MdOutlineMenuBook />,
    url: '/guides',
    title: 'Unikraft Guides'
  },
  {
    icon: <FaLaptopCode />,
    url: '/hackathons',
    title: 'Unikraft Hackathons'
  },
  {
    icon: <RiPresentationFill />,
    url: '/community/talks',
    title: 'Unikraft Talks'
  },
  {
    icon: <IoCalendarSharp />,
    url: '/community/events',
    title: 'Unikraft Events'
  },
  {
    icon: <GrCertificate />,
    url: '/community/papers',
    title: 'Unikraft Publications'
  },
]

interface BlogAuthorProps {
  authors: string[]
}

const BlogAuthor = (props: BlogAuthorProps) => {
  return (
    <HStack marginTop="2" mb="2" spacing="2" display="flex" alignItems="center">
      {/* <Image
        borderRadius="full"
        boxSize="40px"
        src="https://100k-faces.glitch.me/random-image"
        alt={`Avatar of ${props.name}`}
      /> */}
      <Text fontWeight="medium">{props.authors.join(', ')}</Text>
    </HStack>
  )
}

function BlogEntry(props: { entry: IBlog }) {
  const {
    title,
    authors,
    slug,
    publishedDate,
    description,
    tags,
  } = props.entry

  return (
    <LinkBox
      as='article'
      p='5'
      borderWidth='1px'
      rounded='md'
      bg='white'
      transform='auto'
      transition='all 0.1s ease-in-out'
      _hover={{
        textDecoration: 'none',
        translateY: '-2px',
      }}
      _dark={{
        bg: 'ukblue.950'
      }}
    >
      <BlogTags tags={tags} />
      <Heading size='md' my='2'>
        <LinkOverlay href={slug}>
          {title}
        </LinkOverlay>
      </Heading>
      <BlogAuthor authors={authors} />
      <Text mb='3'>
        {convertBackticksToInlineCode(description)}
      </Text>
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Link flex={1} alignItems={'center'}>
          <Text>{relativeTimeFromDates(new Date(publishedDate))}</Text>
        </Link>
        <Text>
          Read more
          <Box display={'inline-block'} w={4} h={4} ml={2} mb={-0.5}>
            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </Box>
        </Text>
      </Flex>
    </LinkBox>
  )
}

function Blogs() {
  const blogs = allBlogs.sort((a, b) => (
    compareDesc(new Date(a.publishedDate), new Date(b.publishedDate)))
  )

  return (
    <>
      <SEO
        title="Technical Blog"
        description="Get the latest articles and news from Unikraft Open-Source Project."
      />
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
            flexDirection={'column'}
          >
            <VStack
              className="bg-backdrop"
              pt={'20'}
              pb={'28'}
              px={4}
              zIndex={0}
            >
              <Heading as='h1' size='xl'>
                The Unikraft Technical Blog
              </Heading>
              <Text mt='4' fontSize={{ md: 'xl' }}>
                Get the latest articles and news from Unikraft Open-Source Project.
              </Text>
            </VStack>
            <Container zIndex={10}>
              <Box
                mt={-12}
                p={5}
                borderWidth='1px'
                borderColor={'rgba(0,0,0,.1)'}
                borderTopColor={'orange.500'}
                borderTopWidth='5px'
                rounded='md'
                bg='white'
                _dark={{
                  bg: 'slate.900',
                  borderColor: 'slate.600',
                  borderTopColor: 'orange.500'
                }}
              >
                <Grid
                  gridTemplateRows={{
                    // base: "auto auto auto",
                    base: "min-content 1fr",
                    xl: '1fr'
                  }}
                  gridTemplateColumns={{
                    base: '1fr',
                    lg: '1fr auto',
                    xl: 'auto 1fr auto'
                  }}
                  gridGap={{
                    base: 0,
                    lg: 5
                  }}
                  templateAreas={{
                    base: `"content"
                           "left"
                           "right"`,
                    lg: `"content right"
                         "content left"`,
                    xl: `"left content right"`
                  }}
                >
                  <GridItem area={'left'} position={'relative'}>
                    <Box w="xs" position={'sticky'} top={5}>
                      <Heading as='h4' size='sm' textTransform={'uppercase'} mb='4'>Resources</Heading>
                      <VStack spacing={2}>
                        {resources.map((resource, i) => (
                          <ResourceLink key={i} {...resource} />
                        ))}
                      </VStack>
                    </Box>
                  </GridItem>
                  <GridItem area={'content'}>
                    <SimpleGrid columns={1} spacing='20px'>
                      {blogs.map((entry, i) => (
                        <BlogEntry key={i} entry={entry} />
                      ))}
                    </SimpleGrid>
                  </GridItem>
                  <GridItem area={'right'}>
                    <VStack w="xs" position={'sticky'} top={5} spacing={5}>
                      <DiscordCard />
                      <KraftCloudAd />
                    </VStack>
                  </GridItem>
                </Grid>
              </Box>
            </Container>
          </GridItem>
          <GridItem area={'footer'}>
            <Footer />
          </GridItem>
        </GridItem>
      </Grid>
    </>
  )
}

export default Blogs

