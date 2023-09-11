import { compareDesc } from 'date-fns'
import {
  Heading,
  VStack,
  Tag,
  SimpleGrid,
  LinkOverlay,
  Grid,
  LinkBox,
  GridItem,
  HStack,
  Text
} from '@chakra-ui/react'
import { allBlogs } from 'contentlayer/generated'
import Container from 'components/container'
import Footer from 'components/footer'
import Header from 'components/header'
import SEO from 'components/seo'
import { convertBackticksToInlineCode } from 'utils/convert-backticks-to-inline-code'
import { Blog as IBlog } from 'contentlayer/generated'

const BlogTags = (props: any) => {
  const { marginTop = 0, tags } = props

  return (
    <HStack spacing={2} marginTop={marginTop}>
      {tags.map((tag) => {
        return (
          <Tag
            fontFamily={'mono'}
            size={'md'}
            variant="solid"
            colorScheme="orange"
            key={tag}
          >
            #{tag}
          </Tag>
        )
      })}
    </HStack>
  )
}

interface BlogAuthorProps {
  date: Date
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
      <Text>—</Text>
      <Text>{props.date.toLocaleDateString()}</Text>
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
      <BlogAuthor authors={authors} date={new Date(publishedDate)} />
      <Text mb='3'>
        {convertBackticksToInlineCode(description)}
      </Text>
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
              py={'20'}
              px={4}
            >
              <Heading as='h1' size='xl'>The Unikraft Technical Blog</Heading>
              <Text mt='4' fontSize={{ md: 'xl' }}>Get the latest articles and news from Unikraft Open-Source Project.</Text>
            </VStack>
            <Container py={10}>
              <SimpleGrid columns={{
                base: 1,
                md: 2,
                xl: 3,
              }} spacing='20px'>
                {blogs.map((entry, i) => (
                  <BlogEntry key={i} entry={entry} />
                ))}
              </SimpleGrid>
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
