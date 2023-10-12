import { Box, Link as ChakraLink, Image, SimpleGrid, Text } from '@chakra-ui/react'
import Link from 'next/link'

const LanguageLink = (props) => {
  const { accentColor, href, children, name } = props
  return (
    <Link passHref href={href}>
      <ChakraLink
        bg='white'
        display='block'
        shadow='xl'
        border='solid 1px'
        borderColor='slate.200'
        textDecoration='none'
        borderRadius='xl'
        overflow='hidden'
        transform='auto'
        transition='all 0.1s ease-in-out'
        _dark={{
          borderColor: 'ukblue.600',
          bg: 'ukblue.900'
        }}
        _hover={{ textDecoration: 'none', translateY: '-2px', shadow: 'md' }}
      >
        <Box pt='4'>
          {children}
          <Box bg={accentColor} mt='4' py='1' color='white'>
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
        href='https://github.com/unikraft/app-helloworld-cpp'
        accentColor='#659AD2'
        name='C/C++'
      >
        <Image alt='C/C++' src='/logos/lang-cpp.svg' maxW='20' minH='24' mx='auto' />
      </LanguageLink>
      {/* <LanguageLink
        href='/getting-started/lang-go'
        accentColor='#05A8D3'
        name='Go'
      >
        <Image alt='Go' src='/logos/lang-go.svg' maxW='20' minH='24' mx='auto' />
      </LanguageLink> */}
      <LanguageLink
        href='https://github.com/unikraft/app-python3'
        accentColor='#3772A4'
        name='Python3'
      >
        <Image alt='Python 3' src='/logos/lang-python3.svg' maxW='20' minH='24' mx='auto' />
      </LanguageLink>
      {/* <LanguageLink
        href='/getting-started/runtime-node-guide'
        accentColor='#74AB63'
        name='Node'
      >
        <Image alt='Node' src='/logos/runtime-node.svg' maxW='20' minH='24' mx='auto' />
      </LanguageLink> */}
    </SimpleGrid>
  )
}
