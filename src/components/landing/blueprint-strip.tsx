import {
  Stack,
  Box,
  HStack,
  VStack,
  Icon,
  Text,
  BoxProps,
  chakra,
  Grid,
  SimpleGrid,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  GridItem,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import Container from 'components/container'
import { CheckIcon } from '@chakra-ui/icons'
import { FaArrowRight } from 'react-icons/fa'
import { UnikraftOverviewBlueprint } from 'components/svgs'

const Blueprint = (props) => {
  const { children, ...rest } = props
  return (
    <Box
      bg='#0D1326'
      p='16.5px'
      border='solid 1px rgba(255,255,255,0.1)'
      minH='100%'
      {...rest}
    >
      <Box
        color='slate.100'
        border='solid 0.9px white'
        backgroundImage={'/blueprint-tile.svg'}
        backgroundRepeat={'repeat'}
        backgroundSize={'6.3%'}
        w='100%'
        minH='100%'
        p='8'
        {...rest}
      >
        {children}
      </Box>
    </Box>
  )
}

export function BlueprintStrip(props: BoxProps) {
  const features = [
    "Blazing fast",
    "Developer-friendly",
    "Small footprint & green",
    "Cloud-native ready",
    "POSIX-compatible",
    "Fully modular",
    "Research-backed",
    "Production ready",
  ]

  return (
    <>
    <Box
      className='bg-blueprint'
      overflow='visible'
      {...props}
    >
      <Container
        py={{
          base: 4,
          sm: 8,
          xl: 12,
          '2xl': 24,
        }}
      >
        <SimpleGrid
          columns={{
            base: 12,
            md: 24
          }}
          gap={{
            base: 0,
            md: 6,
          }}
          rowGap={{
            base: 4,
            sm: 6,
          }}
        >
          <Box
            display={{
              base: 'none',
              sm: 'flex'
            }}
            backgroundClip={'padding-box'}
            overflow='hidden'
            border='solid 1px rgba(255,255,255,0.1)'
            bg='#0D1326'
            h='100%'
            gridColumn={{
              base: 'span 12/span 12',
              md: 'span 24/span 24',
              lg: 'span 15/span 15',
              xl: 'span 14/span 14',
            }}
            gridRow={{
              base: 'span 2/span 2',
            }}
            order={{
              base: 2,
              'xl': 'initial'
            }}
          >
            <UnikraftOverviewBlueprint width='100%' />
          </Box>

          <Blueprint
            order={{
              base: 1,
              'xl': 'initial'
            }}
            gridColumn={{
              base: 'span 12/span 12',
              md: 'span 24/span 24',
              lg: 'span 24/span 24',
              xl: 'span 10/span 10',
            }}
          >
            <chakra.h1
              apply='mdx.h1'
              mt='0px'
              borderBottom="solid 1px white"
              pb='6'
            >
              Easily construct the
              <Box
                as='span'
                color='orange.400'
                backgroundClip={'text'}
                backgroundImage={'linear-gradient(to bottom left, orange.600 0%, orange.300 100%)'}
              >
                {' '}best-in-class{' '}
              </Box>
              OS/kernel for your cloud application and desired KPIs.
            </chakra.h1>
            <Text pt='6'>
              Unikraft is fully modular, with a constantly growing ecosystem with many popular open-source operating system and application libraries like <code>musl</code> and <code>openssl</code> available for use, allowing you to pick and choose exactly what you need for your target application.
            </Text>
          </Blueprint>

          <Blueprint
            order={{
              base: 3,
              xl: 'initial'
            }}
            gridColumn={{
              base: 'span 12/span 12',
              md: 'span 24/span 24',
              lg: 'span 9/span 9',
              xl: 'span 10/span 10',
            }}
            // height='100%'
            display='flex'
            justifyContent={'space-around'}
            alignItems={'center'}
            flexDirection={'column'}
          >
            <SimpleGrid width='100%' columns={{
              base: 1,
              sm: 2,
              md: 4,
              lg: 3,
            }} gap={6}>
              <Stat>
                <StatNumber>100+</StatNumber>
                <StatLabel>Libraries</StatLabel>
              </Stat>
              <Stat>
                <StatNumber>160+</StatNumber>
                <StatLabel>Syscalls</StatLabel>
              </Stat>
              <Stat>
                <StatNumber>25K+</StatNumber>
                <StatLabel>Config Options</StatLabel>
              </Stat>
              <Stat>
                <StatNumber>Any</StatNumber>
                <StatLabel>Application</StatLabel>
              </Stat>
            </SimpleGrid>
          </Blueprint>

        </SimpleGrid>

        <Box
          mt={{
            base: 4,
            sm: 8,
            '2xl': 24,
          }}
          mb={{
            lg: -20,
            xl: -32,
          }}
          rounded='lg'
          bg='white'
          zIndex={'20'}
          position={'relative'}
          shadow='xl'
        >
          <Box p='10'>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            {features.map((feature, id) => (
              <HStack key={id} align={'top'}>
                <Box color={'green.400'} px={2}>
                  <Icon as={CheckIcon} />
                </Box>
                <VStack align={'start'}>
                  <Text color='slate.600' fontSize='xl' fontWeight={'semibold'}>{feature}</Text>
                </VStack>
              </HStack>
            ))}
            </SimpleGrid>
          </Box>
          <Box borderTop='solid 1px var(--chakra-colors-slate-200)' p='8' textAlign={'center'}>
            <NextLink href={`/docs/`} passHref>
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
                  sm: 6,
                }}
                rightIcon={<FaArrowRight fontSize='0.8em' />}
              >
                Explore more in the Docs
              </chakra.a>
            </NextLink>
          </Box>
        </Box>
      </Container>
    </Box>
    </>
  );
}
