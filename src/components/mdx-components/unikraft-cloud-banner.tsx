import * as React from 'react';
import { Box, Heading, Flex, chakra } from '@chakra-ui/react';
import { CompanyUnikraftCloud } from 'components/logos';
import { t } from 'utils/i18n';

export const UnikraftCloudBanner = ({ title, url, children, ...rest }: {
  title: { string }
  url: { string }
  children: React.ReactNode
}) => {
  return (
    <Box
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
      p={4}
      {...rest}
    >
      <Flex
        justifyContent={'space-between'}
        alignItems='start'
      >
        <Box maxW='200px' mt='1' mb='5' display='flex' alignItems={'center'}>
          <CompanyUnikraftCloud width='100%' />
        </Box>
        <chakra.button
          width={{ base: '100%', md: 'auto' }}
          mt={{ base: '6', lg: 0 }}
          color='gray.800'
          as='a'
          justifyContent='center'
          display='inline-flex'
          alignItems='center'
          href='https://unikraft.cloud'
          rel='noopener'
          textDecoration={'none !important'}
          target='_blank'
          fontWeight='bold'
          shadow='md'
          bg='white'
          px='4'
          py='2.5'
          boxShadow={'md'}
          rounded='sm'
          fontSize='md'
          transform='auto'
          transition='all 0.1s ease-in-out'
          _hover={{ textDecoration: 'none', translateY: '-2px', shadow: 'lg' }}
        >
          {t('component.unikraft-cloud-strip.learn-more')}
        </chakra.button>
      </Flex>
      <Heading size='md' mt={0}>
        {title || t('component.unikraft-cloud-strip.heading')}
      </Heading>
      <Box opacity={0.7} pt={3}>
        {children || t('component.unikraft-cloud-strip.description')}
      </Box>
    </Box>
  )
}
