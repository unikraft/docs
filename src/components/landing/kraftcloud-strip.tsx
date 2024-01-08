import {
  Flex,
  Box,
  Heading,
  Text,
  BoxProps,
  chakra,
} from '@chakra-ui/react';
import { CompanyKraftCloud } from 'components/logos'
import Container from 'components/container'
import { t } from 'utils/i18n'

export function KraftCloudStrip(props: BoxProps) {
  return (
    <Box
      {...props}
      bg='#000A0D'
      borderTopWidth='1px'
      borderBottomWidth='1px'
      borderTopColor='ukblue.400'
      borderBottomColor='#333'
    >
      <Container
        pt={8}
        pb={{
          base: 4,
          sm: 8,
        }}
      >
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align='center'
          justify='space-between'
        >
          <Flex
            color='white'
            direction={{ base: 'column', sm: 'row' }}
            gap={{
              base: 8,
              sm: 0,
            }}
          >
            <Box maxW='md' mr='8' display='flex' alignItems={'center'}>
              <CompanyKraftCloud width='100%' />
            </Box>
            <Box>
              <Heading size='md' lineHeight='1.2' mb={{ base: 4, sm: 1 }}>
                {t('component.kraftcloud-strip.heading')}
              </Heading>
              <Text opacity={0.7}>
                {t('component.kraftcloud-strip.description')}
              </Text>
            </Box>
          </Flex>
          <chakra.button
            width={{ base: '100%', md: 'auto' }}
            mt={{ base: '6', lg: 0 }}
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
            h='56px'
            rounded='lg'
            fontSize='md'
            transform='auto'
            transition='all 0.1s ease-in-out'
            _hover={{ textDecoration: 'none', translateY: '-2px', shadow: 'lg' }}
          >
            {t('component.kraftcloud-strip.learn-more')}
          </chakra.button>
        </Flex>
      </Container>
    </Box>
  );
}
