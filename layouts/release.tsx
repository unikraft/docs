import PageContainer from 'components/page-container'
import Sidebar from 'components/sidebar/sidebar'
import cliSidebar from 'configs/cli.sidebar.json'
import gettingStartedSidebar from 'configs/getting-started.sidebar.json'
import conceptsSidebar from 'configs/concepts.sidebar.json'
import internalsSidebar from 'configs/internals.sidebar.json'
import guidesSidebar from 'configs/guides.sidebar.json'
import communitySidebar from 'configs/community.sidebar.json'
import figmaSidebar from 'configs/figma.sidebar.json'
import semverRSort from 'semver/functions/rsort'
import { ReactNode } from 'react'
import { RouteItem } from 'utils/get-route-context'
import { Frontmatter } from 'src/types/frontmatter'
import { List, ListItem } from '@chakra-ui/react'
import SidebarLink from 'components/sidebar/sidebar-link'
import NextLink from 'next/link'
import { allReleases, Releases as IRelease } from 'contentlayer/generated'
import TocNav from 'components/toc-nav'
import { t } from 'utils/i18n'
import { PiCalendarDuotone, PiGitCommitBold } from 'react-icons/pi'
import { MdOutlineDifference } from 'react-icons/md'
import { ImNewspaper } from 'react-icons/im'
import {
  Text,
  Stack,
  SimpleGrid,
  Icon,
  Code,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react'

export function getRoutes(slug: string): RouteItem[] {
  // for home page, use docs sidebar
  if (slug === '/') {
    return gettingStartedSidebar.routes as RouteItem[]
  }

  const configMap = {
    '/getting-started': gettingStartedSidebar,
    '/docs/styled-system': internalsSidebar,
    '/docs/hooks': conceptsSidebar,
    '/docs/cli': cliSidebar,
    '/guides': guidesSidebar,
    '/community': communitySidebar,
    '/figma': figmaSidebar,
  }

  const [, sidebar] =
    Object.entries(configMap).find(([path]) => slug.startsWith(path)) ?? []

  const routes = sidebar?.routes ?? []
  return routes as RouteItem[]
}

export function getVersions(): RouteItem[] {
  var releasesMap = allReleases.reduce(function(map, obj) {
    map[obj.version] = obj;
    return map;
  }, {});

  return semverRSort(
    allReleases.map(({ version }) => version),
  ).map((version) => ({
    title: `v${version} (${releasesMap[version].codename})`,
    path: `/releases/v${version}`,
  }))
}

interface MDXLayoutProps {
  frontmatter: Frontmatter
  release: IRelease
  children: ReactNode
  hideToc?: boolean
  maxWidth?: string
}

export default function MDXLayout(props: MDXLayoutProps) {
  const { frontmatter, release, children, maxWidth } = props

  const topBar = [
    {
      icon: PiCalendarDuotone,
      label: 'Release Date',
      text: new Date(release.releaseDate).toDateString(),
    },
    {
      icon: PiGitCommitBold,
      label: 'Git Commit',
      text: 
      <NextLink href={`https://github.com/unikraft/unikraft/tree/RELEASE-${release.version}`} passHref>
        <chakra.a
          as={Code}
          variant={'outline'}
          fontSize={'md'}
          _hover={{
            cursor: 'pointer',
            bg: useColorModeValue('slate.200', 'ukblue.500'),
          }}
        >
          {release.commit.substring(0,12)}
        </chakra.a>
      </NextLink>
    },
    {
      icon: MdOutlineDifference,
      label: 'Changelog',
      text: release.changelog !== undefined ? (
        <NextLink href={release.changelog} passHref>
          <chakra.a
            textDecoration={'underline'}
            textUnderlineOffset={'2px'}
            textDecorationColor={'slate.400'}
            _hover={{
              textDecorationColor: 'ukblue.400'
            }}
          >
            View Changelog
          </chakra.a>
        </NextLink>
      ) : undefined
    },
    {
      icon: ImNewspaper,
      label: 'Blog Post',
      text: release.blogPost !== undefined ? (
        <NextLink href={release.blogPost} passHref>
          <chakra.a
            textDecoration={'underline'}
            textUnderlineOffset={'2px'}
            textDecorationColor={'slate.400'}
            _hover={{
              textDecorationColor: 'ukblue.400'
            }}
          >
            Read Blog Post
          </chakra.a>
        </NextLink>
      ) : undefined
    }
  ]

  const routes = getRoutes(frontmatter.slug)
  const versions = getVersions()
  return (
    <PageContainer
      hideToc={true}
      maxWidth={maxWidth}
      frontmatter={frontmatter}
      leftSidebar={<Sidebar routes={routes} />}
      rightSidebar={
        <TocNav title={t('component.table-of-content.versions')}>
          <List mt={2}>
            {versions.map(({ title, path }) => (
              <ListItem key={path}>
                <SidebarLink href={path}>{title}</SidebarLink>
              </ListItem>
            ))}
          </List>
        </TocNav>
      }
    >
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        spacing={{ base: 4 }}
        w={'full'}
        borderBottom={'solid 1px'}
        pb={'5'}
        borderBottomColor='slate.200'
        _dark={{
          borderBottomColor: 'slate.600'
        }}
      >
        {topBar.filter((stat) => stat.text !== undefined).map((stat) => (
          <Stack
            key={stat.label}
            direction={'row'}
            align={'center'}
            spacing={2}
          >
            <Stack direction={'row'} align={'center'}>
              <Icon boxSize={5} color={'ukblue.400'} as={stat.icon} />
            </Stack>
            <Text fontWeight={500}>{stat.text}</Text>
          </Stack>
        ))}
      </SimpleGrid>
      {children}
    </PageContainer>
  )
}
