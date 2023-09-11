import {
  Box,
  Text,
  BoxProps,
  Heading,
  chakra,
  SimpleGrid,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import Container from 'components/container'
import { GreenPowerUsage } from 'components/svgs';
import * as React from 'react'

export function GreenStrip(props: BoxProps) {
  return (
    <Box
      {...props}
      className='bg-green'
    >
      <Container
        maxW={{
          md: '6xl',
        }}
        px={{
          base: 4,
          sm: 8,
          lg: 8,
          xl: 0,
        }}
        py={{
          base: 4,
          sm: 8,
          md: 10,
          '2xl': 24
        }}
      >
        <SimpleGrid
          columns={{
            base: 12,
            md: 24
          }}
          rowGap={{
            base: 3,
            sm: 8,
          }}
          gap={{
            base: 0,
            sm: 8
          }}
        >
          <Box
            order={{
              base: 2,
              xl: 'initial'
            }}
            gridColumn={{
              base: 'span 12/span 12',
              sm: 'span 6/span 6',
              md: 'span 8/span 8',
              lg: 'span 6/span 6',
              xl: 'span 5/span 5',
            }}
            gridColumnStart={{
              xl: 1
            }}
            mt={{
              xl: 8
            }}
            rounded='lg'
            backgroundImage={'linear-gradient(to bottom right, green.400 0%, green.500 100%)'}
            shadow={'sm'}
            py={8}
            px={4}
            border={'solid 1px var(--chakra-colors-green-900)'}
            textAlign={'center'}
            ring={'1'}
            ringColor={'green.400'}
            ringInset={'inset'}
          >
            <Text as="span" display='block' fontWeight={'bold'} textColor={'white'} fontSize={'xl'}>
              <Text as="span" display='inline-block' fontSize='4xl'>70%</Text> less
            </Text>
            <Text as="span" mt='1' display='block' color='green.100'>
              <Text as="span" fontWeight='bold' color='white'>Power consumption</Text>{' '}
              compared to Alpine Linux &amp; Raspbian.
            </Text>
          </Box>

          <Box
            order={{
              base: 1,
              xl: 'initial'
            }}
            gridColumn={{
              base: 'span 12/span 12',
              md: 'span 24/span 24',
              xl: 'span 12/span 12',
            }}
            rounded='lg'
            bg='white'
            shadow='xl'
            mt={{
              xl: 2
            }}
            p={8}
            border={'solid 1px var(--chakra-colors-green-900)'}
            textAlign={'center'}
          >
            <Text as="span" textTransform='uppercase' fontWeight='bold' color='green.600' size='lg' mb='2'>
              Small Footprint
            </Text>
            <Heading
              fontWeight={'bold'}
              color={'green.900'}
              mb='2'
              fontSize={{ base: '3xl', sm: '4xl' }}
            >
              Unikraft is green &amp; efficient
            </Heading>
            <Text as="span" mt={3} color='green.700'>
              From cloud to embedded devices, running an application on Unikraft both increases efficiency and reduces power consumption as less resources are necessary.
            </Text>
          </Box>
          <Box
            order={{
              base: 3,
              md: 5,
              lg: 3,
              xl: 'initial'
            }}
            gridColumn={{
              base: 'span 12/span 12',
              sm: 'span 6/span 6',
              md: 'span 8/span 8',
              lg: 'span 7/span 7',
            }}
            mt={{
              xl: 14,
            }}
            rounded='lg'
            shadow='lg'
            ring={'1'}
            ringColor={'green.300'}
            ringInset={'inset'}
            p={8}
            backgroundImage={'linear-gradient(to bottom right, green.300 0%, green.400 100%)'}
            textAlign={'center'}
            border={'solid 1px var(--chakra-colors-green-900)'}
          >
            <Text as="span" display='block' fontWeight={'bold'} textColor={'white'} fontSize={'4xl'}>
              Kilobytes
            </Text>
            <Text as="span" mt={1} display='block' textColor={'white'}>
              <Text as="span" fontWeight={'bold'} display={'inline-block'}>Idle memory usage</Text> for popular apps like NGINX or Redis.
            </Text>
          </Box>

          <Box
            order={{
              base: 3,
              lg: 4,
              xl: 'initial'
            }}
            gridColumn={{
              base: 'span 12/span 12',
              md: 'span 16/span 16',
              lg: 'span 11/span 11',
              xl: 'span 10/span 10',
            }}
            gridColumnStart={{
              xl: 2
            }}
            rounded='lg'
            shadow='lg'
            bg='green.300'
            p={6}
            ring={'1'}
            ringColor={'green.200'}
            ringInset={'inset'}
            border={'solid 1px var(--chakra-colors-green-900)'}
          >
            <GreenPowerUsage />
          </Box>

          <NextLink href={'/docs/concepts/efficiency'} passHref>
            <chakra.a
              as={Box}
              role={'group'}
              order={{
                base: 5,
                md: 4,
                lg: 5,
                xl: 'initial'
              }}
              gridColumn={{
                base: 'span 12/span 12',
                md: 'span 16/span 16',
                lg: 'span 24/span 24',
                xl: 'span 12/span 12',
              }}
              mb={{
                xl: 5,
              }}
              rounded='lg'
              shadow='lg'
              bg='white'
              p={8}
              textAlign={'center'}
              display={'grid'}
              transform='auto'
              transition='all 0.1s ease-in-out'
              _hover={{
                textDecoration: 'none',
                translateY: '-2px',
                shadow: 'xl',
                cursor: 'pointer',
              }}
              border={'solid 1px var(--chakra-colors-green-900)'}
            >
              <Text as="span" display='block' mb={4} textColor={'green.700'}>
                Unikraft supports{' '}
                <Text as="span" display={'inline-block'} fontWeight={'medium'}>ARM</Text>
                {' '}and{' '}
                <Text as="span" display={'inline-block'} fontWeight={'medium'}>ARM64</Text>
                {' '}architectures and popular platforms including{' '}
                <Text as="span" display={'inline-block'} fontWeight={'medium'}>Raspberry Pi B+</Text>.
              </Text>
              <Text as="span" textColor={'green.400'} fontWeight={'bold'} _groupHover={{ textDecoration: 'underline' }}>
                Learn more about embedded devices →
              </Text>
            </chakra.a>
          </NextLink>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
