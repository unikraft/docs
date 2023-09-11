import { Box, Icon, useBoolean } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import CodeContainer from './code-container'
import CopyButton from './copy-button'
import Highlight from './highlight'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const ReactLiveBlock = dynamic(() => import('./react-live-block'))

function CodeBlock(props) {
  const [isMounted, { on }] = useBoolean()
  useEffect(
    /**
     * Lazily-load <ReactLiveBlock /> to save bundle size.
     */
    on,
    [on],
  )
  const {
    className,
    live = true,
    manual,
    render,
    children,
    viewlines,
    nocopy,
    variant = 'default',
    ln,
    mountStylesheet = false,
  } = props.children.props

  const _live = live === 'true' || live === true

  const language = className?.replace(/language-/, '')
  const rawCode = children.trim()

  const reactLiveBlockProps = {
    rawCode,
    language,
    noInline: manual,
    mountStylesheet,
  }

  if (isMounted && language === 'jsx' && _live === true) {
    return <ReactLiveBlock editable {...reactLiveBlockProps} />
  }

  if (isMounted && render) {
    /**
     * @TODO Not sure if this is even used?
     */
    return (
      <div style={{ marginTop: 32 }}>
        <ReactLiveBlock editable={false} {...reactLiveBlockProps} />
      </div>
    )
  }

  return (
    <Box id='codeblock' className={`codeblock-${variant}`} position='relative' zIndex='0'>
      <CodeContainer px='0' overflow='hidden'>
        <Highlight
          codeString={rawCode}
          language={language}
          metastring={ln}
          showLines={viewlines}
        />
      </CodeContainer>
      {!nocopy && (variant == "default") && <CopyButton top='4' code={rawCode} />}
      {
        (variant == "good" || variant == "bad") && <Icon
          top='4'
          aria-label='copy'
          position='absolute'
          fontSize='xl'
          mt='2px'
          color={variant == "good" ? 'green.500' : 'red.500'}
          zIndex='1'
          right='4'
          mr='2px'
          as={variant == "good" ? FaCheckCircle : FaTimesCircle}
        />
      }
    </Box>
  )
}

export default CodeBlock
