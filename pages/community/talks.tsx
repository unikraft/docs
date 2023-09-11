import {
  Button,
  Heading,
  SimpleGrid,
  Text,
  chakra,
  Tag,
  Card,
  CardHeader,
  CardFooter,
  Image,
} from '@chakra-ui/react'
import fs from 'fs'
import NextLink from 'next/link'
import MDXLayout from 'layouts/mdx'
import { Talk as ITalk } from 'src/types/talk'
import { t } from 'utils/i18n'
import { BiInfoCircle } from 'react-icons/bi'
import { GoVideo } from 'react-icons/go'
import { RiSlideshowLine } from 'react-icons/ri'
import { load } from "js-yaml";

function Talk(props: { talk: ITalk }) {
  const {
    title,
    year,
    presenters,
    slides,
    video,
    url,
    thumbnail,
    venue,
  } = props.talk

  return (
    <Card
      maxW='md'
      position='relative'
      justify='space-between'
      border='1px'
      shadow='none'
      borderColor='slate.200'
      _dark={{
        borderColor: 'slate.700'
      }}
      transform='auto'
      transition='all 0.1s ease-in-out'
      _hover={{ textDecoration: 'none', translateY: '-2px', shadow: 'md' }}
    >
      <NextLink href={video || slides || "/404"} passHref>
        <chakra.a display='block'>
          <Image
            objectFit='cover'
            src={thumbnail}
            roundedTop='md'
          />
          <CardHeader>
            <Tag size='sm'>{venue}</Tag>
            <Heading size='sm' my='1'>{title}</Heading>
            <Text><span>by</span> {presenters.map((presenter) => presenter.name).join(', ')}</Text>
          </CardHeader>
        </chakra.a>
      </NextLink>
      <CardFooter
        justify='space-between'
        flexWrap='wrap'
        borderTop='1px'
        borderTopColor='slate.200'
        _dark={{
          borderTopColor: 'slate.700'
        }}
      >
        { video && 
          <NextLink href={video} passHref>
            <Button
              as='a'
              flex='1' 
              variant='ghost'
              leftIcon={<GoVideo />}
            >
              Video
            </Button>
          </NextLink>
        }
        { slides && 
          <NextLink href={slides} passHref>
            <Button
              as='a'
              flex='1' 
              variant='ghost'
              leftIcon={<RiSlideshowLine />}
            >
              Slides
            </Button>
          </NextLink>
        }
        { url && 
          <NextLink href={url} passHref>
            <Button
              as='a'
              flex='1' 
              variant='ghost'
              leftIcon={<BiInfoCircle />}
            >
              Details
            </Button>
          </NextLink>
        }
      </CardFooter>
    </Card>
  )
}

interface TalkProps {
  talks: ITalk[]
}

function Talks({ talks }: TalkProps) {
  return (
    <MDXLayout
      hideToc={true}
      maxWidth={'100%'}
      frontmatter={{
        title: t('talks.seo.title'),
        description: t('talks.seo.description'),
        slug: '/community/talks',
      }}
    >
      <Text lineHeight='tall' mt='5'>
        {t('talks.message')}
      </Text>

      <SimpleGrid columns={{
        sm: 2,
        md: 3
      }} spacing='20px' pt='8'>
        {talks.map((talk, i) => (
          <Talk key={i} talk={talk} />
        ))}
      </SimpleGrid>

    </MDXLayout>
  )
}

export async function getStaticProps() {
  /**
   * Read metadata for each talk from `data/talks.json`.
   */
  const talks = load(fs.readFileSync('data/talks.yaml', 'utf-8'));

  return {
    props: {
      talks
    },
  }
}

export default Talks
