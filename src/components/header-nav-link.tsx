import { HTMLChakraProps, chakra, useColorModeValue } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

function NavLink(props: HTMLChakraProps<'a'>) {
  const { href, ...rest } = props
  const { pathname } = useRouter()

  const [, group] = href.split('/')
  const isActive = pathname.includes(group)

  return (
    <NextLink href={href} passHref>
      <chakra.a
        aria-current={isActive ? 'page' : undefined}
        display='block'
        py='1'
        px='3'
        borderRadius='md'
        transition='all 0.3s'
        color='ukblue.50'
        fontWeight='medium'
        _hover={{
          shadow: '0 0 0 2px var(--chakra-colors-ukblue-200)',
          bg: useColorModeValue('ukblue.700', 'whiteAlpha.200'),
        }}
        _activeLink={{
          fontWeight: 'semibold',
          color: 'white',
        }}
        {...rest}
      />
    </NextLink>
  )
}

export default NavLink
