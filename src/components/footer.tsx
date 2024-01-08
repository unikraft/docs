import {
  Icon,
  Link,
  Stack,
  Text,
  HStack,
  Box,
  SimpleGrid,
  StackProps,
} from '@chakra-ui/react'
import React from 'react'
import {
  BsGithub,
  BsLinkedin,
  BsTwitter,
  BsDiscord,
  BsYoutube,
} from 'react-icons/bs'
import { DiscordStrip } from 'components/discord-strip'
import { t } from 'utils/i18n'
import footerLinks from 'configs/footer.json'
import {
  PoweredByUnikraftInverse,
  LinuxFoundation,
  XenProject,
} from 'components/logos';
import Container from './container'

type FooterLinkProps = {
  icon?: React.ElementType
  href?: string
  label?: string
}

const socials = [
  {
    icon: BsGithub,
    label: 'GitHub',
    href: 'https://github.com/unikraft',
  },
  {
    icon: BsLinkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/unikraft-sdk/',
  },
  {
    icon: BsTwitter,
    label: 'Twitter',
    href: 'https://twitter.org/UnikraftSDK',
  },
  {
    icon: BsDiscord,
    label: 'Discord',
    href: 'https://unikraft.org/discord',
  },
  {
    icon: BsYoutube,
    label: 'YouTube',
    href: 'https://www.youtube.com/@unikraft',
  }
]

const ListHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

export const Footer = (props: StackProps) => (
  <Box
    bg={'slate.900'}
    _dark={{
      bg: 'slate.950'
    }}
    color={'white'}
  >
    <DiscordStrip />
    <Container py={10}>
      <SimpleGrid
        templateColumns={{
            base: '1fr',
            sm: '1fr 1fr',
            md: '1fr 2fr 1fr 2fr 2fr 2fr',
        }}
        spacing={8}>
        <Box pr='8' display={{ base: 'none', md: 'block' }}>
          <PoweredByUnikraftInverse />
        </Box>
        <Stack
          spacing={8}
          pr={{
            base: 0,
            md: 8,
          }}
          direction={{
            base: 'row',
            md: 'column'
          }}
        >
          <LinuxFoundation />
          <XenProject />
        </Stack>
        <Box></Box>
        {Object.entries(footerLinks).map((f, i) => (
          <Stack
            key={i}
            align={{
              base: 'flex-start',
              sm: 'flex-end'
            }}
          >
            <ListHeader>{f[1].title}</ListHeader>
            {f[1].routes.map((route, i) => (
              <Link key={i} color='slate.500' href={route.path}>{route.title}</Link>
            ))}
          </Stack>
        ))}
      </SimpleGrid>
      <Box
        display={{
          base: 'block',
          sm: 'flex'
        }}
        textAlign={{
          base: 'center',
          sm: 'left',
        }}
        justifyContent='space-between'
        mt='8'
        pt='8'
        borderTop='1px'
        borderTopColor='slate.800'
        color='slate.500'
      >
        <Text mb={{
          base: 4,
          sm: 0,
        }}>
          &copy; {(new Date()).getFullYear()} &nbsp;
          {t('component.footer.copyright')}
        </Text>
        <HStack
          spacing='5'
          textAlign={'center'}
          justifyContent={{
            base: 'center',
            sm: 'right'
          }}
        >
          {socials.map((social, i) => (
            <Link
              key={i}
              isExternal
              aria-label={social.label}
              href={social.href}
            >
              <Icon
                as={social.icon}
                display='block'
                transition='color 0.2s'
                w='5'
                h='5'
                _hover={{ color: 'gray.600' }}
              />
            </Link>
          ))}
        </HStack>
      </Box>
    </Container>
  </Box>
)

export default Footer
