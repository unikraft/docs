import PageContainer from 'components/page-container'
import Pagination from 'components/pagination'
import Sidebar from 'components/sidebar/sidebar'
import cliSidebar from 'configs/cli.sidebar.json'
import gettingStartedSidebar from 'configs/getting-started.sidebar.json'
import conceptsSidebar from 'configs/concepts.sidebar.json'
import contributingSidebar from 'configs/contributing.sidebar.json'
import internalsSidebar from 'configs/internals.sidebar.json'
import guidesSidebar from 'configs/guides.sidebar.json'
import communitySidebar from 'configs/community.sidebar.json'
import { ReactNode } from 'react'
import { findRouteByPath, removeFromLast } from 'utils/find-route-by-path'
import { getRouteContext, RouteItem } from 'utils/get-route-context'
import { Frontmatter } from 'src/types/frontmatter'

export function getRoutes(slug: string): RouteItem[] {
  // for home page, use docs sidebar
  if (slug === '/') {
    return gettingStartedSidebar.routes as RouteItem[]
  }

  const configMap = {
    '/docs/getting-started': gettingStartedSidebar,
    '/docs/contributing': contributingSidebar,
    '/docs/concepts': conceptsSidebar,
    '/docs/cli': cliSidebar,
    '/docs/internals': internalsSidebar,
    '/guides': guidesSidebar,
    '/community': communitySidebar,
    '/hackathons': communitySidebar
  }

  const [, sidebar] =
    Object.entries(configMap).find(([path]) => slug.startsWith(path)) ?? []

  const routes = sidebar?.routes ?? []
  return routes as RouteItem[]
}

interface MDXLayoutProps {
  frontmatter: Frontmatter
  children: ReactNode
  hideToc?: boolean
  maxWidth?: string
}

export default function MDXLayout(props: MDXLayoutProps) {
  const { frontmatter, children, hideToc, maxWidth } = props

  const routes = getRoutes(frontmatter.slug)
  const route = findRouteByPath(removeFromLast(frontmatter.slug, '#'), routes)
  const routeContext = getRouteContext(route, routes)

  return (
    <PageContainer
      hideToc={hideToc}
      maxWidth={maxWidth}
      frontmatter={frontmatter}
      leftSidebar={<Sidebar routes={routes} />}
      pagination={
        <Pagination
          next={routeContext.nextRoute}
          previous={routeContext.prevRoute}
        />
      }
    >
      {children}
    </PageContainer>
  )
}
