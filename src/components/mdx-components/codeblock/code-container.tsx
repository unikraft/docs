import { Box, BoxProps } from '@chakra-ui/react'

function CodeContainer(props: BoxProps) {
  return (
    <Box
      rounded='8px'
      my='8'
      bg='slate.100'
      border='solid 1px rgba(0,0,0,.05)'
      _dark={{
        bg: 'ukblue.950',
        borderColor: 'rgba(255,255,255,.1)'
      }}
      sx={{ '& > div': { paddingBlock: '5', paddingEnd: '4' } }}
      {...props}
    />
  )
}

export default CodeContainer
