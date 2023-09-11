import { IconButton, ButtonProps, useClipboard } from '@chakra-ui/react'
import React from 'react'
import { t } from 'utils/i18n'
import { LuCopy, LuCopyCheck } from 'react-icons/lu'

interface CopyButtonProps extends ButtonProps {
  code: string
}

function CopyButton({ code, ...props }: CopyButtonProps) {
  const { hasCopied, onCopy } = useClipboard(code)

  return (
    <IconButton
      size='sm'
      aria-label='copy'
      rounded='sm'
      position='absolute'
      textTransform='uppercase'
      fontSize='md'
      top='0'
      mt='-5px'
      zIndex='1'
      border='solid 1px rgba(255,255,255,0.1)'
      right='0.7em'
      icon={hasCopied
        ? (<LuCopyCheck />)
        : (<LuCopy />)}
      {...props}
      onClick={onCopy}
    />
  )
}

export default CopyButton
