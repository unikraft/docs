import {
  Box,
  Flex,
  HStack,
  HTMLChakraProps,
  Icon,
  IconButton,
  Button,
  Link,
  chakra,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useUpdateEffect,
} from '@chakra-ui/react'
import { useScroll } from 'framer-motion'
import NextLink from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { PiSunBold, PiMoonStarsFill } from 'react-icons/pi'
import Logo from './unikraft-logo'
import {
  BsGithub,
  BsDiscord,
  BsYoutube,
} from 'react-icons/bs'
import { MobileNavButton, MobileNavContent } from './mobile-nav'
import Search from './omni-search'
import siteConfig from 'configs/site-config.json'
import NavLink from 'components/header-nav-link'
import navbarLinks from 'configs/header-navbar.json'

function HeaderContent() {
  const mobileNav = useDisclosure()

  const { toggleColorMode: toggleMode } = useColorMode()

  const text = useColorModeValue('dark', 'light')
  const SwitchIcon = useColorModeValue(PiSunBold, PiMoonStarsFill)
  const mobileNavBtnRef = useRef<HTMLButtonElement>()

  useUpdateEffect(() => {
    mobileNavBtnRef.current?.focus()
  }, [mobileNav.isOpen])

  return (
    <>
      <Flex
        w='100%'
        h='100%'
        px={{
          base: '4',
          sm: '6',
          '2xl': '0'
        }}
        align='center'
        justify='space-between'
      >
        <Flex align='center'>
          <NextLink href='/' passHref>
            <chakra.a display='block' aria-label='Unikarft, Back to homepage'>
              <Logo pr='9px' />
            </chakra.a>
          </NextLink>
        </Flex>

        <HStack px='4' spacing='2' w='100%' display={{ base: 'none', lg: 'flex' }}>
          {navbarLinks.map((link) => (
            <NavLink href={link.href} key={link.label}>
              {link.label}
            </NavLink>
          ))}
        </HStack>

        <Flex
          justify='flex-end'
          w='100%'
          align='center'
          color='gray.400'
          maxW='500px'
        >

          <HStack pr='4' spacing='5' display={{ base: 'none', lg: 'flex' }}>
            <Link
              isExternal
              aria-label='Go to Unikraft GitHub page'
              href={siteConfig.repo.url}
            >
              <Icon
                as={BsGithub}
                display='block'
                transition='color 0.2s'
                w='5'
                h='5'
                _hover={{ color: 'gray.600' }}
              />
            </Link>
            <Link
              isExternal
              aria-label='Go to Unikraft Discord page'
              href='/discord'
            >
              <Icon
                as={BsDiscord}
                display='block'
                transition='color 0.2s'
                w='5'
                h='5'
                _hover={{ color: 'gray.600' }}
              />
            </Link>
            <Link
              isExternal
              aria-label='Go to Unikraft YouTube channel'
              href={siteConfig.youtube}
            >
              <Icon
                as={BsYoutube}
                display='block'
                transition='color 0.2s'
                w='5'
                h='5'
                _hover={{ color: 'gray.600' }}
              />
            </Link>
          </HStack>

          <Search />

          <HStack spacing='3'>
            <IconButton
              size='md'
              fontSize='lg'
              aria-label={`Switch to ${text} mode`}
              variant='ghost'
              color='current'
              bg={'rgba(255,255,255,0.1)'}
              ml={3}
              onClick={toggleMode}
              icon={<SwitchIcon />}
            />
            <MobileNavButton
              ref={mobileNavBtnRef}
              aria-label='Open Menu'
              onClick={mobileNav.onOpen}
            />
          </HStack>

        </Flex>
      </Flex>
      <MobileNavContent isOpen={mobileNav.isOpen} onClose={mobileNav.onClose} />
    </>
  )
}

function Header(props: HTMLChakraProps<'header'>) {
  const { maxW = '8xl', maxWidth = '8xl' } = props
  const ref = useRef<HTMLHeadingElement>()
  const [y, setY] = useState(0)
  const { height = 0 } = ref.current?.getBoundingClientRect() ?? {}

  const { scrollY } = useScroll()
  useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()))
  }, [scrollY])

  return (
    <chakra.header
      ref={ref}
      shadow={y > height ? 'sm' : undefined}
      transition='box-shadow 0.2s, background-color 0.2s'
      zIndex='3'
      bg='ukblue.950'
      _dark={{
        bg: '#091124',
        // borderBottomColor: 'ukblue.900'
      }}
      // left='0'
      // right='0'
      width='full'
      {...props}
    >
      <chakra.div height='4.5rem' mx='auto' maxW={maxW} maxWidth={maxWidth}>
        <HeaderContent />
      </chakra.div>
    </chakra.header>
  )
}

export default Header
