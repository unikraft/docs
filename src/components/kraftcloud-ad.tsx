import * as React from 'react';
import { Box, VStack, Heading, Flex, chakra } from '@chakra-ui/react';
import { CompanyKraftCloud } from 'components/logos';
import { t } from 'utils/i18n';

export const KraftCloudAd = ({ title, url, children }: {
  title: { string }
  url: { string }
  children: React.ReactNode
}) => {
  return (
    <VStack
      w='full'
      backgroundImage={'/space.jpg'}
      backgroundSize={'cover'}
      backgroundColor={'black'}
      rounded={'lg'}
      borderColor={"gray.700"}
      borderWidth={2}
      outline={'solid'}
      outlineColor={'black'}
      outlineOffset={-1}
      color={'white'}
      spacing={5}
      p={4}
    >
      <Flex
        alignItems='start'
        w={'100%'}
      >
        <Box maxW='200px' mt='2' display='flex' alignItems={'center'}>
          <CompanyKraftCloud width='100%' />
        </Box>
      </Flex>
      <Heading size='md'>
        {title || t('component.kraftcloud-strip.heading')}
      </Heading>
      <Box opacity={0.7}>
        {children || t('component.kraftcloud-strip.description')}
      </Box>
      <chakra.button
        mt={{ base: '6', md: 0 }}
        color='gray.800'
        as='a'
        justifyContent='center'
        display='inline-flex'
        alignItems='center'
        href='https://kraft.cloud'
        rel='noopener'
        target='_blank'
        fontWeight='bold'
        shadow='md'
        bg='white'
        px='24px'
        w='100%'
        h='56px'
        rounded='sm'
        fontSize='md'
        transform='auto'
        transition='all 0.1s ease-in-out'
        _hover={{ textDecoration: 'none', translateY: '-2px', shadow: 'lg' }}
      >
        {t('component.kraftcloud-strip.learn-more')}
      </chakra.button>
    </VStack>
  )
}
