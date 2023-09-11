import { SearchIcon } from '@chakra-ui/icons'
import {
  HStack,
  HTMLChakraProps,
  Kbd,
  Portal,
  Text,
  VisuallyHidden,
  chakra,
} from '@chakra-ui/react'
import { DocSearchModal, useDocSearchKeyboardEvents } from '@docsearch/react'
import type {
  InternalDocSearchHit,
  StoredDocSearchHit,
} from '@docsearch/react/dist/esm/types'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { t } from 'utils/i18n'

const ACTION_KEY_DEFAULT = ['Ctrl', 'Control']
const ACTION_KEY_APPLE = ['⌘', 'Command']

interface HitProps {
  hit: InternalDocSearchHit | StoredDocSearchHit
  children: React.ReactNode
}

function Hit({ hit, children }: HitProps) {
  return (
    <Link href={hit.url} passHref>
      <a>{children}</a>
    </Link>
  )
}

export const SearchButton = React.forwardRef(function SearchButton(
  props: HTMLChakraProps<'button'>,
  ref: React.Ref<HTMLButtonElement>,
) {
  const [actionKey, setActionKey] = React.useState<string[]>(ACTION_KEY_APPLE)
  React.useEffect(() => {
    if (typeof navigator === 'undefined') return
    const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)
    if (!isMac) {
      setActionKey(ACTION_KEY_DEFAULT)
    }
  }, [])

  return (
    <chakra.button
      flex='1'
      type='button'
      ref={ref}
      lineHeight='1.2'
      w='100%'
      ml={{ base: 4, lg: 2 }}
      bg='white'
      whiteSpace='nowrap'
      display={{ base: 'none', sm: 'flex' }}
      alignItems='center'
      color='gray.600'
      _dark={{ bg: 'gray.700', color: 'gray.400' }}
      py='2.5'
      px='3'
      outline='0'
      _focus={{ shadow: 'outline' }}
      shadow='base'
      rounded='md'
      {...props}
    >
      <SearchIcon />
      <HStack w='full' ml='3' spacing='4px'>
        <Text textAlign='left' flex='1'>
          {t('component.algolia-search.search-the-docs')}
        </Text>
        <HStack spacing='4px'>
          <VisuallyHidden>
            {t('component.algolia-search.press')}{' '}
          </VisuallyHidden>
          <Kbd rounded='2px'>
            <chakra.div
              as='abbr'
              title={actionKey[1]}
              textDecoration='none !important'
            >
              {actionKey[0]}
            </chakra.div>
          </Kbd>
          <VisuallyHidden> {t('component.algolia-search.and')} </VisuallyHidden>
          <Kbd rounded='2px'>K</Kbd>
          <VisuallyHidden>
            {' '}
            {t('component.algolia-search.to-search')}
          </VisuallyHidden>
        </HStack>
      </HStack>
    </chakra.button>
  )
})

function AlgoliaSearch() {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const searchButtonRef = React.useRef()
  const [initialQuery, setInitialQuery] = React.useState(null)

  const onOpen = React.useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const onClose = React.useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const onInput = React.useCallback(
    (e) => {
      setIsOpen(true)
      setInitialQuery(e.key)
    },
    [setIsOpen, setInitialQuery],
  )

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  })

  return (
    <>
      <Head>
        <link
          rel='preconnect'
          href='https://0Y6SVWJDUS-dsn.algolia.net'
          //@ts-expect-error
          crossOrigin='true'
        />
      </Head>
      <SearchButton onClick={onOpen} ref={searchButtonRef} />
      {isOpen && (
        <Portal>
          <DocSearchModal
            placeholder='Search the docs'
            initialQuery={initialQuery}
            initialScrollY={window.scrollY}
            onClose={onClose}
            indexName='unikraft'
            apiKey='7997f4960bc7a01d21c00c1fd4d61b22'
            appId='0Y6SVWJDUS'
            //@ts-expect-error we allow this error because we don't need what is missing here.
            navigator={{
              navigate({ suggestionUrl }) {
                setIsOpen(false)
                router.push(suggestionUrl)
              },
            }}
            hitComponent={Hit}
            transformItems={(items) => {
              return items.map((item) => {
                const a = document.createElement('a')
                a.href = item.url
                const hash = a.hash === '#content-wrapper' ? '' : a.hash
                item.url = `${a.pathname}${hash}`
                return item
              })
            }}
          />
        </Portal>
      )}
    </>
  )
}

export default AlgoliaSearch
