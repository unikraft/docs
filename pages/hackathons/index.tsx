import { ArrowForwardIcon } from '@chakra-ui/icons'
import { compareDesc, format, parseISO } from 'date-fns'
import {
  Card,
  chakra,
  Image,
  Button,
  Heading,
  Link,
  CardBody,
  CardHeader,
  CardFooter,
  Tag,
  SimpleGrid,
  Stack,
  StackDivider,
  Text
} from '@chakra-ui/react'
import { allHackathons } from 'contentlayer/generated'
import MDXLayout from 'layouts/mdx'
import NextLink from 'next/link'
import { t } from 'utils/i18n'
import { Hackathons as IHackathon } from 'contentlayer/generated'
import { PiNotePencilBold } from 'react-icons/pi'
import { IoArrowForward } from 'react-icons/io5'

function Hackathon(props: { hackathon: IHackathon }) {
  const {
    title,
    description,
    slug,
    image,
    startDate,
    registerForm,
    address,
    map,
    partners,
    hosts
  } = props.hackathon

  return (
    <Card
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
      <NextLink href={slug} passHref>
        <chakra.a display='block'>
          <Image
            objectFit='cover'
            src={image}
            roundedTop='md'
          />
          <CardHeader>
            <Heading size='md' my='1'>{title}</Heading>
            <Text>{description}</Text>
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
        {
          new Date(startDate) > new Date(new Date().toDateString()) &&
          (
          <NextLink href={registerForm} passHref>
            <Button
              as='a'
              variant='outline'
              colorScheme='orange'
              leftIcon={<PiNotePencilBold />}
            >
              Sign up
            </Button>
          </NextLink>
          )
        }
        <NextLink href={slug} passHref>
          <Button
            as='a'
            variant='ghost'
            rightIcon={<IoArrowForward />}
          >
            View details
          </Button>
        </NextLink>
      </CardFooter>
    </Card>
  )
}

function Hackathons() {
  const hackathons = allHackathons.sort((a, b) => compareDesc(new Date(a.startDate), new Date(b.startDate)))

  return (
    <MDXLayout
      hideToc={true}
      maxWidth={'100%'}
      frontmatter={{
        title: t('hackathons.seo.title'),
        description: t('hackathons.seo.description'),
        slug: '/hackathons',
      }}
    >
      <Text lineHeight='tall' mt='5'>
        {t('hackathons.message')}
      </Text>

      <SimpleGrid columns={{
        sm: 1,
        md: 2
      }} spacing='20px' pt='8'>
        {hackathons.map((hackathon, i) => (
          <Hackathon key={i} hackathon={hackathon} />
        ))}
      </SimpleGrid>
    </MDXLayout>
  )
}

export default Hackathons
