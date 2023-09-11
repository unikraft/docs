import { Box, BoxProps } from '@chakra-ui/react'
import React from 'react'

export const Container = (props: BoxProps) => (
  <Box
    w='full'
    pb='12'
    pt='3'
    maxW={{ base: '2xl', md: '8xl' }}
    mx='auto'
    px={{
      base: '4',
      sm: '6',
      '2xl': '0'
    }}
    {...props}
  />
)

export default Container
