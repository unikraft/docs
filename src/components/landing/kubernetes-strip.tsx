import {
  BoxProps,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Image,
} from '@chakra-ui/react'
import { FaArrowRight } from 'react-icons/fa'
import Container from 'components/container'

export function KubernetesStrip(props: BoxProps) {
  return (
    <Box
      zIndex='-2'
      className='bg-kubernetes'
      {...props}
    >
      <Container pt='32' pb='24'>
        <Stack
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          direction={{ base: 'column', md: 'row' }}>
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Box>
              <Text textTransform='uppercase' fontWeight='semibold' color='ukblue.500' size='lg' mb='2'>
                Production Ready
              </Text>
              <Heading
                fontWeight={'bold'}
                color={'ukblue.900'}
                fontSize={{ base: '3xl', sm: '4xl' }}>
                <Text
                  as={'span'}
                  textShadow={'0px 1px rgba(255,255,255,0.5)'}
                >
                  Super-charge your
                </Text>
                <br />
                <Text
                  as={'span'}
                  backgroundClip={'text'}
                  backgroundImage={'linear-gradient(to bottom left, blue.400 0%, ukblue.500 100%)'}
                >
                  Kubernetes Deployments
                </Text>
              </Heading>
            </Box>
            <Text fontSize='xl' color={'slate.800'}>
              Integrate Unikraft seamlessly into your existing Kubernetes cluster by packaging your unikernel into an OCI-compatible image and using the custom RuntimeClass.
            </Text>
            <Stack spacing={{ base: 4, sm: 6 }} mt='3' direction={{ base: 'column', sm: 'row' }}>
              <Button
                size={'lg'}
                fontWeight={'semibold'}
                px={6}
                color={'ukblue.500'}
                bg={'white'}
                shadow={'sm'}
                border='solid 1px rgba(255,255,255,0.1)'
                rightIcon={<FaArrowRight fontSize='0.8em' />}
              >
                Get started with Kubernetes
              </Button>
            </Stack>
          </Stack>
          <Flex
            flex={1}
            justify={'center'}
            align={'center'}
            position={'relative'}
            w={'full'}>
            <Box
              position={'relative'}
              rounded={'xl'}
              border={'solid 1px rgba(255,255,255,0.4)'}
              width={'full'}
              overflow={'hidden'}>
              <Image
                alt={'Hero Image'}
                fit={'cover'}
                align={'center'}
                w={'100%'}
                h={'100%'}
                src={'/kubekraft.svg'}
              />
            </Box>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}
