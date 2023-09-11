async function redirect() {
  return [
    {
      source: '/discord',
      destination: 'https://discord.com/invite/RG5ZQGKxyW',
      permanent: false,
    },
    // GENERAL
    {
      source: '/docs',
      destination: '/docs/getting-started',
      permanent: true,
    },
    {
      source: '/community',
      destination: '/community/about',
      permanent: true,
    },
    {
      source: '/community/publications',
      destination: '/community/papers',
      permanent: true,
    },
    {
      source: '/community/hackathons',
      destination: '/hackathons',
      permanent: true,
    },
    {
      source: '/community/hackathons/:slug',
      destination: '/hackathons/:slug',
      permanent: true,
    },
    {
      source: '/docs/features/security',
      destination: '/docs/concepts/security',
      permanent: true,
    },
    {
      source: '/docs/features/green',
      destination: '/docs/concepts/efficiency',
      permanent: true,
    },
    {
      source: '/docs/features/posix-compatibility',
      destination: '/docs/concepts/compatibility',
      permanent: true,
    },
    {
      source: '/docs/features/performance',
      destination: '/docs/concepts/performance',
      permanent: true,
    },
    {
      source: '/docs/internals',
      destination: '/docs/internals/architecture',
      permanent: true,
    },
    {
      source: '/docs/concepts/architecture',
      destination: '/docs/internals/architecture',
      permanent: true,
    },
    {
      source: '/releases',
      destination: '/releases/latest',
      permanent: false,
    },
    {
      source: '/docs/cli/reference/kraftfile/latest',
      destination: '/docs/cli/reference/kraftfile/v0.5',
      permanent: false,
    },
    {
      source: '/docs/cli/reference/kraftfile',
      destination: '/docs/cli/reference/kraftfile/latest',
      permanent: true,
    },
  ]
}

module.exports = redirect
