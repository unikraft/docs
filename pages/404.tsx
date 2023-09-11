import {
  Button,
  Heading,
  Text,
  VStack,
  Grid,
  Card,
  Stack,
  CardBody,
  CardFooter,
  GridItem,
} from '@chakra-ui/react'
import * as React from 'react'
import NextLink from 'next/link'
import Header from 'components/header'
import Footer from 'components/footer'
import SEO from 'components/seo'
import { t } from 'utils/i18n'

const NotFoundPage = () => {
  return (
    <>
      <SEO
        title={t('notfound.title')}
        description={t('notfound.description')}
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
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Card
              direction={{ base: 'column', sm: 'row' }}
              overflow='hidden'
              variant='outline'
              maxW={{
                xl: '3xl'
              }}
              mx='auto'
            >
              <VStack
                justify='center'
                as='section'
                p='12'
                textAlign='center'
                mx='auto'
              >
                <Heading as='h1' size='4xl'>{t('notfound.heading')}</Heading>
                <Text mt='4' fontSize={{ md: 'xl' }}>{t('notfound.message')}</Text>
                <pre style={{
                  textAlign: 'left'
                }}>&nbsp;&nbsp;_<br />c'o'o  .-.<br />(| |)_/   &apos;<br />
                </pre>
              </VStack>

              <Stack p='4'>
                <CardBody>
                  <Heading size='xl'>{t('notfound.title')}</Heading>
                  <Text py='2'>
                    {t('notfound.description')}
                  </Text>
                </CardBody>
                <CardFooter
                  justify='space-between'
                  flexWrap='wrap'
                  borderTopColor='slate.200'
                  _dark={{
                    borderTopColor: 'slate.700'
                  }}
                >
                  <NextLink href="/" passHref>
                    <Button variant='solid' colorScheme='blue'>
                    {t('notfound.take-me-home')}
                    </Button>
                  </NextLink>
                  <NextLink href="https://github.com/unikraft/docs/issues/new" passHref>
                    <Button variant='ghost' colorScheme='blue'>
                    {t('notfound.open-an-issue')}
                    </Button>
                  </NextLink>
                </CardFooter>
              </Stack>
            </Card>
          </GridItem>
          <GridItem
            area={'footer'}
          >
            <Footer />
          </GridItem>
        </GridItem>
      </Grid>
    </>
  )
}

export default NotFoundPage
