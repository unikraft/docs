import {
  chakra,
  useColorModeValue,
} from '@chakra-ui/react'
import BaseHighlight, {
  Language,
  PrismTheme,
  defaultProps,
} from 'prism-react-renderer'
import React from 'react'
import { liveEditorStyle } from './styles'
import PrismCore from 'prismjs/components/prism-core'
import themeDark  from 'prism-react-renderer/themes/oceanicNext'
import themeLight  from 'prism-react-renderer/themes/github'

import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-hcl'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-diff'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-toml'
import 'prismjs/components/prism-json'

const RE = /{([\d,-]+)}/

const calculateLinesToHighlight = (meta: string) => {
  if (!RE.test(meta)) {
    return () => false
  }
  const lineNumbers = RE.exec(meta)[1]
    .split(`,`)
    .map((v) => v.split(`-`).map((x) => parseInt(x, 10)))

  return (index: number) => {
    const lineNumber = index + 1
    const inRange = lineNumbers.some(([start, end]) =>
      end ? lineNumber >= start && lineNumber <= end : lineNumber === start,
    )
    return inRange
  }
}

interface HighlightProps {
  codeString: string
  language: Language
  metastring?: string
  showLines?: boolean
}

function Highlight({
  codeString,
  language,
  metastring,
  showLines,
  ...props
}: HighlightProps) {
  const shouldHighlightLine = calculateLinesToHighlight(metastring)
  const theme = useColorModeValue(themeLight, themeDark)

  return (
    <BaseHighlight
      {...defaultProps}
      Prism={PrismCore}
      code={codeString}
      theme={theme}
      language={language}
      {...props}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div style={liveEditorStyle} data-language={language}>
          <pre className={className}>
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line, key: i })
              return (
                <chakra.div
                  key={i}
                  pl='4'
                  pr='5'
                  bg={shouldHighlightLine(i) ? 'blackAlpha.50' : undefined}
                  _dark={{
                    bg: shouldHighlightLine(i) ? 'whiteAlpha.50' : undefined
                  }}
                  borderLeft={'solid 4px transparent'}
                  borderLeftColor={shouldHighlightLine(i) ? 'blue.500' : 'transparent'}
                  {...lineProps}
                >
                  {showLines && (
                    <chakra.span opacity={0.3} mr='6' fontSize='xs'>
                      {i + 1}
                    </chakra.span>
                  )}
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </chakra.div>
              )
            })}
          </pre>
        </div>
      )}
    </BaseHighlight>
  )
}

export default Highlight
