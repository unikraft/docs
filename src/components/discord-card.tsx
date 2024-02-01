import { Box, BoxProps, Flex, Heading, Text, VStack, chakra } from '@chakra-ui/react'
import * as React from 'react'
import DiscordIcon from './docs/discord-logo'
import { t } from 'utils/i18n'

export function DiscordCard(props: BoxProps) {
  return (
    <VStack
      {...props}
      bg='#5865F2'
      borderWidth='1px'
      spacing={5}
      p={4}
      rounded={'md'}
      borderColor='#2331B5'
      _dark={{
        borderColor: '#808AFF',
      }}
    >
      <Flex
        direction={'row'}
        align='center'
        justify='space-between'
        color='white'
      >
        <Flex
          alignItems='center'
          justifyContent='center'
          fontSize='48px'
          mr='5'
        >
          <DiscordIcon />
        </Flex>
        <Heading size='md' lineHeight='1.2'>
          {t('component.discord-strip.heading')}
        </Heading>
      </Flex>

      <Text color='white' opacity={0.7}>
        {t('component.discord-strip.description')}
      </Text>
      
      <chakra.button
        mt={{ base: '6', md: 0 }}
        color='gray.800'
        as='a'
        justifyContent='center'
        display='inline-flex'
        alignItems='center'
        href='https://unikraft.org/discord'
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
        {t('component.discord-strip.join-discord')}
      </chakra.button>
    </VStack>
  )
}
