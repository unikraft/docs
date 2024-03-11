import {
  Box,
  Text,
  BoxProps,
  Heading,
  Link as ChakraLink,
  GridItem,
  Grid,
  Button,
  Image,
  chakra,
} from '@chakra-ui/react'
import Container from 'components/container'
import * as React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import CopyButton from 'components/mdx-components/codeblock/copy-button'
import CodeContainer from 'components/mdx-components/codeblock/code-container'
import Link from 'next/link'

const PullExample = (props) => {
  const { title, snippet } = props
  return (
    <GridItem
      colSpan={3}
      border={'solid 2px'}
      borderColor={'slate.400'}
      borderRadius={'lg'}
      display={'flex'}
      flexDir={'column'}
      justifyContent={'space-between'}
      p={5}
    >
      <Heading
        fontWeight={'bold'}
        color={'slate.700'}
        fontSize={{ base: 'xl', xl: '2xl' }}
        pb={4}
      >
        {title}
      </Heading>
      <Box
        id='codeblock'
        position='relative'
        display={{
          base: 'none',
          sm: 'block'
        }}
        zIndex='0'
      >
        <CodeContainer
          fontFamily={'mono'}
          fontSize={'md'}
          p='20px'
          rounded={'md'}
          borderColor={'slate.400 !important'}
          m='0'
          color={'slate.900'}
          bg='slate.100 !important'
        >
          {snippet}
        </CodeContainer>
        <CopyButton
          code={snippet}
          mt='0'
          top='1rem'
          right='1rem'
          bg='white'
          borderColor='slate.400'
          color='slate.500'
          _hover={{
            bg: 'slate.200'
          }}
        />
      </Box>
    </GridItem>
    )
}

const AppLink = (props) => {
  const { accentColor, href, children, name, textColor } = props
  let text = textColor
  if (textColor === undefined) {
    text = accentColor == 'white' ? 'black' : 'white'
  }
  return (
    <Link passHref href={href}>
      <ChakraLink
        bg='transparent'
        display='block'
        border='solid 2px'
        borderColor={accentColor}
        textDecoration='none'
        borderRadius='lg'
        overflow='hidden'
        transform='auto'
        transition='all 0.1s ease-in-out'
        _hover={{ textDecoration: 'none', translateY: '-4px', shadow: 'md' }}
      >
        <Box pt='4'>
          {children}
          <Box bg={accentColor} mt='4' py='1' color={text}>
            <Text textAlign='center' fontSize='sm' fontWeight='bold'>
              {name}
            </Text>
          </Box>
        </Box>
      </ChakraLink>
    </Link>
  )
}

export function CatalogStrip(props: BoxProps) {
  return (
    <Box
      {...props}
      bg='white'
    >
      <Container py='24'>
        <Box textAlign={'center'}>
          <Text textTransform='uppercase' fontWeight='bold' color='orange.500' size='lg' mb='2'>
            Get started immediately
          </Text>
          <Heading
            fontWeight={'bold'}
            color={'slate.900'}
            fontSize={{ base: '3xl', sm: '4xl' }}
          >
            Run your favorite apps, frameworks and languages out-of-the-box
          </Heading>
          <Text fontSize='xl' color={'slate.700'} py='8' maxW='6xl' mx='auto'>
            We've put together a catalog covering a wide range of the most popular programming languages, frameworks, and apps as pre-built, ready-to-run, ultra-specialized unikernel virtual machine images.
          </Text>
        </Box>
        <Grid
          mt='6'
          gap='40px'
          fontSize='6xl'
          gridTemplateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(6, 1fr)',
          }}
        >
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/http-c'
            accentColor='#A9BACD'
            name='C'
          >
            <Image alt='C' src='/logos/lang-c.svg' maxW='20' minH='24' mx='auto' />
          </AppLink>
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/http-cpp'
            accentColor='#659AD2'
            name='C++'
          >
            <Image alt='C++' src='/logos/lang-cpp.svg' maxW='20' minH='24' mx='auto' />
          </AppLink>
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/http-cpp-boost'
            accentColor='#659AD2'
            name='C++ Boost'
          >
            <Image alt='C++ Boost' src='/logos/framework-boost.svg' maxW='20' minH='24' mx='auto' />
          </AppLink>
          <PullExample
            title="Try out your first unikernel:"
            snippet="kraft run unikraft.org/helloworld:latest"
            />
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/caddy'
            accentColor='#22B638'
            name='Caddy'
          >
            <Image alt='Caddy' src={`/logos/app-caddy.svg`} maxW='20' minH='24' mx='auto' />
          </AppLink>
          <AppLink
            href='href=https://github.com/unikraft/catalog/tree/main/exanokes/duckdb-go'
            accentColor='black'
            name='DuckDB'
          >
            <Image alt='DuckDB' src={`/logos/framework-duckdb.svg`} maxW='20' minH='24' mx='auto' />
          </AppLink>
          {/*
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/node21-expressjs'
            accentColor='black'
            name='ExpressJS'
          >
            <Image alt='ExpressJS' src={`/logos/framework-expressjs.png`} maxW='40' minH='20' mx='auto' />
          </AppLink>
          */}
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/http-python3.10-flask3.0'
            accentColor='#37A7BD'
            name='Flask'
          >
            <Image alt='Flask' src='/logos/framework-flask.svg' maxW='20' minH='24' mx='auto' />
          </AppLink>
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/http-go1.21'
            accentColor='#01ADD7'
            name='Go'
          >
            <Image alt='Go' src={`/logos/lang-go.svg`} maxW='28' minH='24' mx='auto' />
          </AppLink>
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/hugo'
            accentColor='black'
            name='Gohugo'
          >
            <Image alt='Gohugo' src={`/logos/framework-hugo.svg`} maxW='32' minH='24' mx='auto' />
          </AppLink>
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/http-lua5.4'
            accentColor='#070080'
            name='Lua'
          >
            <Image alt='Lua' src={`/logos/lang-lua.svg`} maxW='24' minH='24' mx='auto' />
          </AppLink>
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/memcached'
            accentColor='#776A65'
            name='Memcached'
          >
            <Image alt='Memcached' src={`/logos/app-memcached.svg`} maxW='20' minH='24' mx='auto' />
          </AppLink>
          {/*
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/node21-nextjs'
            accentColor='black'
            name='NextJS'
          >
            <Image alt='NextJS' src={`/logos/framework-nextjs.svg`} maxW='24' minH='24' mx='auto' />
          </AppLink>
        */}
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/exanokes/nginx'
            accentColor='#009900'
            name='NGINX'
          >
            <Image alt='NGINX' src={`/logos/app-nginx.svg`} maxW='32' minH='24' mx='auto' />
          </AppLink>
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/http-node18'
            accentColor='#74AB63'
            name='Node'
          >
            <Image alt='Node' src={`/logos/runtime-node-dark.svg`} maxW='28' minH='24' mx='auto' />
          </AppLink>
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/http-perl5.38'
            accentColor='black'
            name='Perl'
          >
            <Image alt='Perl' src={`/logos/lang-perl.svg`} maxW='20' minH='24' mx='auto' />
          </AppLink>
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/http-php8.2'
            accentColor='#777BB3'
            name='PHP'
          >
            <Image alt='PHP' src={`/logos/lang-php.svg`} maxW='28' minH='24' mx='auto' />
          </AppLink>
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/http-python3.10'
            accentColor='#3772A4'
            name='Python3'
          >
            <Image alt='Python 3' src='/logos/lang-python3.svg' maxW='20' minH='24' mx='auto' />
          </AppLink>
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/redis'
            accentColor='#D82B1F'
            name='Redis'
          >
            <Image alt='Redis' src={`/logos/app-redis.svg`} maxW='20' minH='24' mx='auto' />
          </AppLink>
          {/*
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/node21-remix'
            accentColor='black'
            name='Remix'
          >
            <Image alt='Remix' src={`/logos/framework-remix.svg`} maxW='24' minH='24' mx='auto' />
          </AppLink>
          */}
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/http-ruby3.2'
            accentColor='#A71501'
            name='Ruby'
          >
            <Image alt='Ruby' src={`/logos/lang-ruby.svg`} maxW='20' minH='24' mx='auto' />
          </AppLink>
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/http-rust1.75'
            accentColor='black'
            name='Rust'
          >
            <Image alt='Rust' src={`/logos/lang-rust-dark.svg`} maxW='20' minH='24' mx='auto' />
          </AppLink>
         <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/http-rust1.75-actix-web4'
            accentColor='black'
            name='Rust Actix'
          >
            <Image alt='Rust Actix' src={`/logos/framework-actix.svg`} maxW='20' minH='24' mx='auto' />
          </AppLink>
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/http-rust1.75-rocket0.5'
            accentColor='#D2394A'
            name='Rust Rocket'
          >
            <Image alt='Rust Rocket' src={`/logos/framework-rocket.svg`} maxW='20' minH='24' mx='auto' />
          </AppLink>
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/http-rust1.75-tokio'
            accentColor='black'
            name='Rust Tokio'
          >
            <Image alt='Rust Tokio' src={`/logos/framework-tokio.svg`} maxW='20' minH='24' mx='auto' />
          </AppLink>
          {/*
          <AppLink
            href='https://github.com/unikraft/catalog/tree/main/examples/node21-solidjs'
            accentColor='#4377bb'
            name='SolidJS'
          >
            <Image alt='SolidJS' src={`/logos/framework-solidjs.svg`} maxW='24' minH='24' mx='auto' />
          </AppLink>
          */}
          {/*
          <PullExample
            title="Run your next Caddy proxy with Unikraft"
            snippet="kraft run --rm -p 2015:2015 unikraft.org/caddy:2.7"
          />
          */}
          {/*
          <PullExample
            title="Set up your next database with Unikraft"
            snippet="kraft run --rm -p 3306:3306 unikraft.org/mariadb:1.25"
            />
          */}
          {/*
          <PullExample
            title="Keep up to date with all the latest apps"
            snippet="kraft pkg ls --update --all --apps"
            />
          */}
          {/*
          <AppLink
            href='#'
            accentColor='#3178c6'
            name='TypeScript'
          >
            <Image alt='TypeScript' src={`/logos/lang-typescript.svg`} maxW='20' minH='24' mx='auto' />
          </AppLink>
          */}
          {/*
          <AppLink
            href='#'
            accentColor='#2BA977'
            name='Django'
          >
            <Image alt='Django' src={`/logos/framework-django.svg`} maxW='20' maxH='24' mx='auto' />
          </AppLink>
          */}
          {/*
          <AppLink
            href='#'
            accentColor='black'
            name='Prisma'
          >
            <Image alt='Prisma' src={`/logos/framework-prisma.svg`} maxW='20' minH='24' mx='auto' />
          </AppLink>
          */}
          {/*
          <AppLink
            href='#'
            accentColor='#565656'
            name='Grafana'
          >
            <Image alt='Grafana' src={`/logos/app-grafana.svg`} maxW='20' minH='24' mx='auto' />
          </AppLink>
          */}
          {/*
          <AppLink
            href='#'
            accentColor='#CC0100'
            name='Ruby on Rails'
          >
            <Image alt='Ruby on Rails' src={`/logos/framework-rails.svg`} maxW='32' minH='24' mx='auto' />
          </AppLink>
          */}
          {/*
          <AppLink
            href='#'
            accentColor='#5382A2'
            name='OpenJDK'
          >
            <Image alt='OpenJDK' src={`/logos/lang-java.svg`} maxW='16' minH='24' mx='auto' />
          </AppLink>
          */}
          {/*
          <AppLink
            href='#'
            accentColor='#01684A'
            name='MongoDB'
          >
            <Image alt='MongoDB' src={`/logos/app-mongodb.svg`} maxW='20' minH='24' mx='auto' />
          </AppLink>
          */}
          {/*
          <AppLink
            href='#'
            accentColor='#C0765B'
            name='MariaDB'
          >
            <Image alt='MariaDB' src={`/logos/app-mariadb.svg`} maxW='24' minH='24' mx='auto' />
          </AppLink>
          */}
          {/*
          <AppLink
            href='#'
            accentColor='#5A3EE0'
            name='Dragonfly'
          >
            <Image alt='Dragonfly' src={`/logos/app-dragonfly.svg`} maxW='24' minH='24' mx='auto' />
          </AppLink>
          */}
          {/*
          <AppLink
            href='#'
            accentColor='#D10AC9'
            name='SurrealDB'
          >
            <Image alt='SurrealDB' src={`/logos/app-surrealdb.svg`} maxW='20' minH='24' mx='auto' />
          </AppLink>
          */}
          {/*
          <AppLink
            href='#'
            accentColor='#24699D'
            name='HAProxy'
          >
            <Image alt='HAProxy' src={`/logos/app-haproxy.svg`} maxW='20' minH='24' mx='auto' />
          </AppLink>
          */}
          {/*
          <AppLink
            href='#'
            accentColor='#C72D48'
            name='MinIO'
          >
            <Image alt='MinIO' src={`/logos/app-minio.svg`} maxW='32' minH='24' mx='auto' />
          </AppLink>
          */}
        </Grid>
        <Box
          mt='16'
          textAlign={'center'}
        >
            <Link href={`https://github.com/unikraft/catalog/tree/main/examples`} passHref>
              <chakra.a
                as={Button}
                color='slate.500'
                bg='slate.100'
                whiteSpace={'normal'}
                textAlign={'center'}
                fontSize={'xl'}
                _hover={{
                  bg: 'slate.200',
                  textDecoration: 'underline'
                }}
                p={{
                  base: 8,
                  sm: 8,
                }}
                rightIcon={<FaArrowRight fontSize='0.8em' />}
              >
                Explore more in the community catalog
              </chakra.a>
            </Link>
          </Box>
      </Container>
    </Box>
  );
}
