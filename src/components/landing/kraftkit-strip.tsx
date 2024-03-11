import {
  Stack,
  Box,
  Text,
  BoxProps,
  chakra,
  Flex,
  SimpleGrid,
  Heading,
  Button,
} from '@chakra-ui/react'
import { FaArrowRight, FaGithub } from 'react-icons/fa'
import Container from 'components/container'
import NextLink from 'next/link'
import { UnikraftOverviewBlueprint } from 'components/svgs'
import { VSCode, CompanyGitHub } from 'components/logos';
import AsciinemaPlayer from 'components/asciinema-player'

export function KraftKitStrip(props: BoxProps) {
  return (
    <Box
      className='bg-kraftkit'
      // borderTop='solid 10px var(--chakra-colors-orange-500)'
      {...props}
    >
      <Container
        pt={{
          base: 4,
          sm: 8,
          lg: 28,
          '2xl': 32,
        }}
        pb={{
          base: 8,
          lg: 12,
          '2xl': 24,
        }}
      >
        <SimpleGrid
          columns={12}
          spacing={{
            base: 0,
            sm: 8,
            lg: 12,
          }}
          rowGap={{
            base: 4,
            sm: 8,
            lg: 12,
          }}
          justifyContent={'space-around'}
          alignItems={'center'}
        >
          <Flex
            justify={'center'}
            align={'center'}
            position={'relative'}
            w={'full'}
            display={{
              base: 'none',
              sm: 'flex'
            }}
            gridColumn={{
              base: 'span 12/span 12',
              lg: 'span 6/span 6'
            }}
          >
            <Box
              position={'relative'}
              rounded={'2xl'}
              width={'full'}
            >
              <AsciinemaPlayer
                zIndex='2'
                position='relative'
                overflow='hidden'
                src="/asciinema/kraft-build-run-pkg.cast" />
              <Box
                zIndex='1'
                position='absolute'
                rounded='xl'
                width='100%'
                height='100%'
                opacity={'80%'}
                bg='#13254D'
                top='0'
                transform={'rotate(-5deg)'}
               />
            </Box>
          </Flex>
          <Stack
            spacing={{ base: 5, lg: 8 }}
            gridColumn={{
              base: 'span 12/span 12',
              lg: 'span 6/span 6'
            }}
            pt={{
              base: 8,
              lg: 4,
              '2xl': 0,
            }}
            px={{
              base: 0,
              lg: 4,
              '2xl': 8,
            }}
          >
            <Box>
              <Text textTransform='uppercase' fontWeight='bold' color='orange.500' size='lg' mb='2'>
                Developer Friendly
              </Text>
              <Heading
                fontWeight={'bold'}
                color={'white'}
                fontSize={{ base: '3xl', sm: '4xl' }}
              >
                Build, Run and Package
                <br />
                Unikernel Images
                <br />
                Quickly and Easily
              </Heading>
            </Box>
            <Text fontSize='xl' color={'slate.400'}>
              With the Unikraft companion command-line client <Text as="code" fontSize="md">kraft</Text>, you can quickly and easily define, configure, build, and run unikernel applications. Get everything from OS library dependencies to pre-built binaries and more.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              mt={{
                base: 0,
                lg: 3,
              }}
              direction={{ base: 'column', sm: 'row' }}
            >
              <NextLink href={`/docs/cli`} passHref>
                <chakra.a
                  as={Button}
                  size={'lg'}
                  fontWeight={'semibold'}
                  px={6}
                  color={'white'}
                  bg={'rgba(255,255,255,0.2)'}
                  shadow={'sm'}
                  border='solid 1px rgba(255,255,255,0.1)'
                  rightIcon={<FaArrowRight fontSize='0.8em' />}
                  _hover={{
                    bg: 'rgba(255,255,255,0.3)'
                  }}
                >
                  Explore the CLI tool
                </chakra.a>
              </NextLink>
            </Stack>
          </Stack>
          <SimpleGrid
            templateColumns={{
              base: '1fr',
              lg: 'auto 1fr'
            }}
            pt={{
              lg: 12
            }}
            px={{
              base: 0,
              lg: 12,
            }}
            gridColumn={{
              base: 'span 12/span 12',
              md: 'span 6/span 6'
            }}
          >
            <Flex
              alignItems='center'
              justifyContent='center'
              fontSize='48px'
              position='relative'
              width='72px'
              height='72px'
              mr='8'
              mb={{
                base: 8,
                lg: 0,
              }}
            >
              <Box zIndex='2'>
              <VSCode width='48px' />
              </Box>
              <Box
                zIndex='1'
                position='absolute'
                rounded='xl'
                width='72px'
                height='72px'
                opacity={'80%'}
                bg='#13254D'
                top='0'
                transform={'rotate(-5deg)'}
              />
            </Flex>
            <Stack
              spacing='4'
              alignItems={'start'}
            >
              <Heading
                size='md'
                lineHeight='1.2'
                mb='1'
                color='white'
              >
                Extra ergonomy in VSCode
              </Heading>
              <Text color='slate.200' pb='1'>
                Library selection, native integration to build and run instances to help developers in VS Code stay confident and productive.
              </Text>
              <NextLink href={`https://github.com/unikraft/ide-vscode`} passHref>
                <chakra.a
                  as={Button}
                  textOverflow={'scroll'}
                  whiteSpace={'normal'}
                  textAlign={'left'}
                  variant='link'
                  color='ukblue.100'
                  textUnderlineOffset='4px'
                  textDecoration='underline'
                  rightIcon={<FaArrowRight fontSize='0.8em' />}
                >
                  Download the VSCode Extension
                </chakra.a>
              </NextLink>
            </Stack>
          </SimpleGrid>
          <SimpleGrid
            templateColumns={{
              base: '1fr',
              lg: 'auto 1fr'
            }}
            pt={{
              lg: 12
            }}
            px={{
              base: 0,
              lg: 12,
            }}
            gridColumn={{
              base: 'span 12/span 12',
              md: 'span 6/span 6'
            }}
          >
            <Flex
              alignItems='center'
              justifyContent='center'
              fontSize='48px'
              position='relative'
              width='72px'
              height='72px'
              mr='8'
              mb={{
                base: 8,
                lg: 0,
              }}
            >
              <Box zIndex='3'>
                <FaGithub width='48px' color='white' />
              </Box>
              <Box
                zIndex='1'
                position='absolute'
                rounded='xl'
                width='72px'
                height='72px'
                opacity={'80%'}
                bg='#13254D'
                top='0'
                transform={'rotate(-5deg)'}
              />
            </Flex>
            <Stack
              spacing='4'
              alignItems={'start'}
            >
              <Heading
                size='md'
                lineHeight='1.2'
                mb='1'
                color='white'
              >
                Instant unikernel playground
              </Heading>
              <Text color='slate.200' pb='1'>
                Try Unikraft without installing any additional dependencies and bootstrap and next project.
              </Text>
              <NextLink href={`/docs/cli`} passHref>
                <chakra.a
                  as={Button}
                  variant='link'
                  whiteSpace={'normal'}
                  textAlign={'left'}
                  color='ukblue.100'
                  textUnderlineOffset='4px'
                  fontWeight='semibold'
                  textDecoration='underline'
                  rightIcon={<FaArrowRight fontSize='0.8em' />}
                >
                  Open in GitHub Codespaces
                </chakra.a>
              </NextLink>
            </Stack>
          </SimpleGrid>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
