import {
  Stack,
  Box,
  Text,
  Button,
  chakra,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa'
import NextLink from 'next/link'
import Container from 'components/container'
import CodeContainer from 'components/mdx-components/codeblock/code-container'
import CopyButton from 'components/mdx-components/codeblock/copy-button'
import { t } from 'utils/i18n'

const announce = {
  title: 'Unikraft releases 0.20.0',
  href: '/blog/2025-09-08-unikraft-releases-v0.20.0',
}

export default function LandingHero() {
  const getKraftKit = 'curl -sSfL https://get.kraftkit.sh | sh'

  return (
    <Box
      as='section'
      bg='ukblue.800'
      className='bg-backdrop'
      >
      <Container
        className='bg-sparkles'
        py={{
          base: 0,
          md: 2,
          lg: 6,
          xl: 10,
          '2xl': 24,
        }}
      >
        <SimpleGrid
          templateColumns={{ xl: '1fr 1fr' }}
          spacing={{
            base: 2,
            sm: 8,
          }}
          my={{
            base: 4,
            sm: 12,
          }}
          alignItems={'center'}
        >
          <Box>
            <Box
              backgroundColor={'ukblue.900'}
              mx={'auto'}
              display={'inline-block'}
              border={'solid 1px #3C5796'}
              rounded={{
                base: 'lg',
                sm: 'full'
              }}
              textAlign={{
                base: 'center',
                sm: 'left'
              }}
              mb={{
                base: 4,
                sm: 7,
              }}
              p='2'
              pr='4'
            >
              <NextLink href={announce.href} passHref>
                <chakra.a
                  as={Box}
                  role={'group'}
                  display={{
                    sm: 'flex'
                  }}
                  alignItems={'center'}
                  justifyContent={'center'}
                  transform='auto'
                  transition='all 0.1s ease-in-out'
                  _hover={{
                    textDecoration: 'none',
                    shadow: 'xl',
                    cursor: 'pointer',
                  }}
                >
                  <Text
                    px='3'
                    display={{
                      base: 'inline-block',
                    }}
                    background='orange.400'
                    textTransform={'uppercase'}
                    fontWeight={'bold'}
                    fontSize={'sm'}
                    rounded={'full'}
                    mb={{
                      base: '3',
                      sm: '0'
                    }}
                    lineHeight={'1.7'}
                    >Latest</Text>
                  <Text
                    ml='4'
                    mr='2'
                    display={'inline-block'}
                    fontWeight={'semibold'}
                    _groupHover={{
                      textDecoration: 'underline'
                    }}
                  >
                    {announce.title}
                  </Text>
                  <Box
                    display={{
                      base: 'none',
                      sm: 'inline',
                    }}
                    transform='auto'
                    transition='all 0.1s ease-in-out'
                    _groupHover={{
                      translateX: '2px'
                    }}
                  >
                    <FaArrowRight
                      display='inline-block'
                      fontSize='0.8em'
                      />
                  </Box>
                </chakra.a>
              </NextLink>
            </Box>
            <chakra.h1
              mx='auto'
              fontSize={{ base: '2.25rem', sm: '3rem', lg: '3rem' }}
              fontFamily='heading'
              letterSpacing='tighter'
              ml='-3px'
              maxW={{
                base: '100%',
                lg: '80%',
                xl: '100%'
              }}
              fontWeight='bold'
              color='white'
              mb='0'
              lineHeight='1.2'
              textAlign={{
                base: 'center',
                md: 'left'
              }}
            >
              {t('homepage.title.main')}
              <Box
                as='span'
                color='orange.400'
                backgroundClip={'text'}
                backgroundImage={'linear-gradient(to bottom left, orange.600 0%, orange.300 100%)'}
              >
                {' '}
                {t('homepage.title.highlighted')}
              </Box>
            </chakra.h1>
          </Box>
          <Stack
            spacing='5'
            direction={'column'}
          >
            <chakra.h2
              fontSize={{ base: '1.1rem' }}
            >
              Unikraft powers the next-generation of cloud native applications by enabling you to radically customize and build custom OS/kernels, unlocking best-in-class performance, security primitives and efficiency savings.
            </chakra.h2>
            <SimpleGrid
              templateColumns={{ md: '2fr 5fr' }}
              spacing={8}
              w={{
                base: 'auto',
                lg: '3xl',
                'xl': 'auto'
              }}
            >
              <NextLink href='/docs/getting-started' passHref>
                <Button
                  h='4rem'
                  px='40px'
                  fontSize='1.2rem'
                  as='a'
                  border='solid 1px rgba(255,255,255,0.1)'
                  size='lg'
                  rightIcon={<FaArrowRight fontSize='0.8em' />}
                  bg='rgba(255,255,255,0.1)'
                  color='white'
                  _hover={{
                    bg: 'rgba(255,255,255,0.2)'
                  }}
                >
                  {t('homepage.get-started')}
                </Button>
              </NextLink>
              <Box
                id='codeblock'
                position='relative'
                // display='inline-block'
                display={{
                  base: 'none',
                  sm: 'block'
                }}
                zIndex='0'
                >
                <CodeContainer
                  fontFamily={'mono'}
                  p='20px'
                  borderColor={'#536DA6 !important'}
                  m='0'
                  bg='ukblue.950'
                >
                  {getKraftKit}
                </CodeContainer>
                <CopyButton
                  code={getKraftKit}
                  mt='0'
                  top='1rem'
                  right='1rem'
                  bg='rgba(255,255,255,0.1)'
                  borderColor='rgba(255,255,255,0.2)'
                  color='slate.200'
                  _hover={{
                    bg: 'rgba(255,255,255,0.15)'
                  }}
                />
              </Box>
            </SimpleGrid>
            <StatGroup
              display={{
                base: 'none',
                sm: 'flex'
              }}
            >
              <Stat>
                <StatNumber>v0.20.0</StatNumber>
                <StatLabel>Latest Version</StatLabel>
              </Stat>
              <Stat>
                <StatNumber>3.2K+</StatNumber>
                <StatLabel>GitHub Stars</StatLabel>
              </Stat>
              <Stat>
                <StatNumber>100+</StatNumber>
                <StatLabel>Contributors</StatLabel>
              </Stat>
              <Stat>
                <StatNumber>1.9K+</StatNumber>
                <StatLabel>Discord Members</StatLabel>
              </Stat>
            </StatGroup>
          </Stack>
        </SimpleGrid>
        {/* <SimpleGrid
          mt='12'
          templateColumns={{ md: '1fr 1fr 1fr' }}
          spacing={8}
        >
          <Stat p='0' border={"solid 1px rgba(255,255,255,0.2)"} backdropFilter={'blur(4px)'} backgroundColor={'rgba(255,255,255,0.05)'}>
            <Image src="/diagrams/nginx-perf.svg" />
            <StatLabel borderTop='solid 1px rgba(255,255,255,.2)' p='4' mt='0' fontWeight='semibold'>Higher Performance</StatLabel>
          </Stat>
          <Stat p='0' border={"solid 1px rgba(255,255,255,0.2)"} backdropFilter={'blur(4px)'} backgroundColor={'rgba(255,255,255,0.05)'}>
            <Image src="/diagrams/nginx-perf.svg" />
            <StatLabel borderTop='solid 1px rgba(255,255,255,.2)' p='4' mt='0' fontWeight='semibold'>Faster Image Transport & Low-Cost Storage</StatLabel>
          </Stat>
          <Stat p='0' border={"solid 1px rgba(255,255,255,0.2)"} backdropFilter={'blur(4px)'} backgroundColor={'rgba(255,255,255,0.05)'}>
            <Image src="/diagrams/nginx-perf.svg" />
            <StatLabel borderTop='solid 1px rgba(255,255,255,.2)' p='4' mt='0' fontWeight='semibold'>...</StatLabel>
          </Stat>
        </SimpleGrid> */}
      </Container>
    </Box>
  );
}
