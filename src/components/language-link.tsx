import { Box, Link as ChakraLink, Image, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react'
import Link from 'next/link'

const LanguageLink = (props) => {
  const { accentColor, href, children, name } = props
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
        _hover={{ textDecoration: 'none', translateY: '-2px', shadow: 'md' }}
      >
        <Box pt='4'>
          {children}
          <Box bg={accentColor} mt='4' py='1' color={accentColor == 'white' ? 'black' : 'white'}>
            <Text textAlign='center' fontSize='sm' fontWeight='bold'>
              {name}
            </Text>
          </Box>
        </Box>
      </ChakraLink>
    </Link>
  )
}

export const LanguageLinks = () => {
  const theme = useColorModeValue('dark', 'light');

  return (
    <SimpleGrid
      mt='6'
      spacing='40px'
      fontSize='6xl'
      columns={{
        base: 1,
        md: 2,
        lg: 4,
      }}
    >
      <LanguageLink
        href='https://github.com/unikraft/catalog/tree/main/examples/helloworld-gcc13.2'
        accentColor='#A9BACD'
        name='C'
      >
        <Image alt='C' src='/logos/lang-c.svg' maxW='20' minH='24' mx='auto' />
      </LanguageLink>
      <LanguageLink
        href='https://github.com/unikraft/catalog/tree/main/examples/helloworld-g++13.2'
        accentColor='#659AD2'
        name='C++'
      >
        <Image alt='C++' src='/logos/lang-cpp.svg' maxW='20' minH='24' mx='auto' />
      </LanguageLink>
      <LanguageLink
        href='https://github.com/unikraft/catalog/tree/main/examples/helloworld-rust1.75'
        accentColor={theme == 'dark' ? 'black' : 'white'}
        name='Rust'
      >
        <Image alt='Rust' src={`/logos/lang-rust-${theme}.svg`} maxW='20' minH='24' mx='auto' />
      </LanguageLink>
      <LanguageLink
        href='https://github.com/unikraft/catalog/tree/main/examples/httpserver-go1.21'
        accentColor='#01ADD7'
        name='Go'
      >
        <Image alt='Go' src={`/logos/lang-go.svg`} maxW='20' minH='24' mx='auto' />
      </LanguageLink>
      <LanguageLink
        href='https://github.com/unikraft/catalog/tree/main/examples/httpserver-python3.10'
        accentColor='#3772A4'
        name='Python3'
      >
        <Image alt='Python 3' src='/logos/lang-python3.svg' maxW='20' minH='24' mx='auto' />
      </LanguageLink>
      <LanguageLink
        href='https://github.com/unikraft/catalog/tree/main/examples/flask3.0-python3.10'
        accentColor='#37A7BD'
        name='Flask'
      >
        <Image alt='Flask' src='/logos/framework-flask.svg' maxW='20' minH='24' mx='auto' />
      </LanguageLink>
      <LanguageLink
        href='https://github.com/unikraft/catalog/tree/main/examples/httpserver-nodejs18'
        accentColor='#74AB63'
        name='Node'
      >
        <Image alt='Node' src={`/logos/runtime-node-${theme}.svg`} maxW='20' minH='24' mx='auto' />
      </LanguageLink>
    </SimpleGrid>
  )
}
