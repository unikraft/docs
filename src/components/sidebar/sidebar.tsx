import {
  Badge,
  Box,
  Center,
  chakra,
  HStack,
  List,
  ListItem,
  ListProps,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, ReactElement, ReactNode, useRef } from 'react'
import {
  FaCompass,
  FaTerminal,
  FaLightbulb,
  FaTools,
} from 'react-icons/fa'
import { PiHandHeartBold } from 'react-icons/pi'
import { convertBackticksToInlineCode } from 'utils/convert-backticks-to-inline-code'
import { RouteItem, Routes } from 'utils/get-route-context'
import SidebarCategory from './sidebar-category'
import SidebarLink from './sidebar-link'

const sortRoutes = (routes: RouteItem[]) => {
  return routes.sort(({ title: titleA }, { title: titleB }) => {
    if (titleA < titleB) return -1
    if (titleA > titleB) return 1
    return 0
  })
}

export type SidebarContentProps = Routes & {
  pathname?: string
  contentRef?: any
}

function NewBadge() {
  return (
    <Badge
      ml='2'
      lineHeight='tall'
      fontSize='10px'
      variant='solid'
      colorScheme='purple'
    >
      New
    </Badge>
  )
}

export function SidebarContent({
  routes,
  pathname,
  contentRef,
}: SidebarContentProps) {
  return (
    <>
      {routes.map((lvl1, idx) => {
        return (
          <Fragment key={idx}>
            {lvl1.heading && (
              <chakra.h4
                fontSize='sm'
                fontWeight='bold'
                my='4'
                textTransform='uppercase'
                letterSpacing='wider'
              >
                {lvl1.title}
              </chakra.h4>
            )}

            {lvl1.routes.map((lvl2, index) => {
              if (!lvl2.routes) {
                return (
                  <SidebarLink
                    ml='-3'
                    mt='2'
                    key={lvl2.path}
                    href={lvl2.path}
                    isExternal={lvl2.external}
                  >
                    {lvl2.title}
                  </SidebarLink>
                )
              }

              const selected = pathname.startsWith(lvl2.path)
              const opened = selected || lvl2.open

              const sortedRoutes = lvl2.sort
                ? sortRoutes(lvl2.routes)
                : lvl2.routes

              return (
                <SidebarCategory
                  contentRef={contentRef}
                  key={lvl2.path + index}
                  title={lvl2.title}
                  selected={selected}
                  opened={opened}
                  mr='3'
                >
                  {sortedRoutes.map((lvl3) => (
                    <SidebarLink key={lvl3.path} href={lvl3.path}>
                      <span>{convertBackticksToInlineCode(lvl3.title)}</span>
                      {lvl3.new && <NewBadge />}
                    </SidebarLink>
                  ))}
                </SidebarCategory>
              )
            })}
          </Fragment>
        )
      })}
    </>
  )
}

type MainNavLinkProps = {
  href: string
  icon: ReactElement
  children: ReactNode
  label?: string
  isActive?: boolean
  isExternal?: boolean
}

const MainNavLink = ({ href, icon, children, isActive, isExternal }: MainNavLinkProps) => {
  const router = useRouter()
  const active = router.asPath.startsWith(href) || !!isActive

  return (
    <NextLink href={href} passHref>
      <HStack
        target={isExternal ? '_blank' : undefined}
        as='a'
        spacing='3'
        fontSize='sm'
        fontWeight={active ? 'semibold' : 'medium'}
        color={active ? 'accent' : 'fg-muted'}
        _hover={{ color: active ? undefined : 'fg' }}
      >
        <Center
          w='6'
          h='6'
          borderWidth='1px'
          bg={active ? 'accent-static' : 'transparent'}
          borderColor={active ? 'accent-static' : undefined}
          rounded='base'
          color={active ? 'white' : 'accent'}
        >
          {icon}
        </Center>
        <span>{children}</span>
      </HStack>
    </NextLink >
  )
}

export const mainNavLinks = [
  {
    icon: <FaCompass />,
    href: '/docs/getting-started',
    label: 'Getting Started',
    external: false,
    new: false,
  },
  {
    icon: <FaLightbulb />,
    href: '/docs/concepts',
    label: 'Concepts',
    match: (asPath: string, href: string) =>
      href.startsWith('/docs/concepts') &&
      asPath.startsWith('/docs/concepts'),
      external: false,
      new: false,
  },
  {
    icon: <FaTerminal />,
    href: '/docs/cli',
    label: 'CLI Reference',
    match: (asPath: string, href: string) =>
      href.startsWith('/docs/cli') && asPath.startsWith('/docs/cli'),
      external: false,
      new: false,
  },
  {
    icon: <FaTools />,
    href: '/docs/internals',
    label: 'Internals',
    match: (asPath: string, href: string) =>
      href.startsWith('/docs/cli') && asPath.startsWith('/docs/cli'),
      external: false,
      new: false,
  },
  {
    icon: <PiHandHeartBold />,
    href: '/docs/contributing',
    label: 'Contributing',
    match: (asPath: string, href: string) =>
      href.startsWith('/docs/cli') && asPath.startsWith('/docs/cli'),
      external: false,
      new: false,
  }
]

export const MainNavLinkGroup = (props: ListProps) => {
  const router = useRouter()

  return (
    <List spacing='4' ml='-2.5' styleType='none' {...props}>
      {mainNavLinks.map((item) => (
        <ListItem key={item.label}>
          <MainNavLink
            icon={item.icon}
            href={item.href}
            label={item.label}
            isActive={item.match?.(router.asPath, item.href)}
            isExternal={item.external}
          >
            {item.label} {item.new && <NewBadge />}
          </MainNavLink>
        </ListItem>
      ))}
    </List>
  )
}

const Sidebar = ({ routes }) => {
  const { pathname } = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <Box
      ref={ref}
      aria-label='Main Navigation'
      as='nav'
      pos='sticky'
      overscrollBehavior='contain'
      w='100%'
      top='0'
      py={{ base: '4', sm: '6', xl: '8' }}
      pr='6'
      pl={{
        base: 3,
        lg: 8,
        '2xl': 3,
      }}
      overflowY='auto'
      className='sidebar-content'
      flexShrink={0}
      display={{ base: 'none', lg: 'block' }}
    >
      <MainNavLinkGroup mb='10' />
      <SidebarContent routes={routes} pathname={pathname} contentRef={ref} />
    </Box>
  )
}

export default Sidebar
