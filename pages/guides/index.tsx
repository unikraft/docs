import { ArrowForwardIcon } from '@chakra-ui/icons'
import { compareDesc, format, parseISO } from 'date-fns'
import {
  Heading,
  VStack,
  SimpleGrid,
  Grid,
  GridItem,
  Text,
  Image,
  Card,
  CardHeader,
  chakra,
} from '@chakra-ui/react'
import { allGuides } from 'contentlayer/generated'
import Footer from 'components/footer'
import SEO from 'components/seo'
import Header from 'components/header'
import NextLink from 'next/link'
import { t } from 'utils/i18n'
import { Guide as IGuide } from 'contentlayer/generated'
import Container from 'components/container'

function Guide(props: { guide: IGuide }) {
  const {
    title,
    description,
    slug,
    image,
    // startDate,
    // registerForm,
    // address,
    // map,
    // partners,
    // hosts
  } = props.guide

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
      {/* <CardFooter
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
      </CardFooter> */}
    </Card>
  )
}

function Guides() {
  const guides = allGuides.sort((a, b) => (
    compareDesc(new Date(a.publishedDate), new Date(b.publishedDate)))
  )

  return (
    <>
      <SEO
        title={t('guides.seo.title')}
        description={t('guides.seo.description')}
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
            >
              <Heading as='h1' size='xl'>{t('guides.seo.title')}</Heading>
              <Text mt='4' fontSize={{ md: 'xl' }}>{t('guides.seo.description')}</Text>
            </VStack>
            <Container py={10}>
              <SimpleGrid columns={{ sm: 2, md: 3 }} spacing='20px'>
                {guides.map((guide, i) => (
                  <Guide key={i} guide={guide} />
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

export default Guides
