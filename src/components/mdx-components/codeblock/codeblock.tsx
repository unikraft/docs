import { Box, Icon } from '@chakra-ui/react'
import CodeContainer from './code-container'
import CopyButton from './copy-button'
import Highlight from './highlight'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

function CodeBlock(props) {
  const {
    className,
    children,
    viewlines,
    nocopy,
    variant = 'default',
    ln,
  } = props.children.props

  const language = className?.replace(/language-/, '')
  const rawCode = children.trim()

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
