import {
  Box,
  Text,
  BoxProps,
  Heading,
  chakra,
  SimpleGrid,
} from '@chakra-ui/react'
import Container from 'components/container'
import { 
  UniLancs,
  UniManchester,
  UniUPB,
  UniKIT,
  UniLiege,
  CompanyNEC,
  CompanyARM,
  CompanyOpensynergy,
  UniTexas,
  UniICL,
} from 'components/logos'
import * as React from 'react'

const Logo = ({ children, ...props }) => {
  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      px='16'
      {...props}
    >{children}</Box>
  )
}

export function ResearchStrip(props: BoxProps) {
  return (
    <Box
      {...props}
      bg='white'
    >
      <Container py='24'>
        <Box textAlign={'center'}>
          <Text textTransform='uppercase' fontWeight='bold' color='orange.500' size='lg' mb='2'>
            Research Backed
          </Text>
          <Heading
            fontWeight={'bold'}
            color={'slate.900'}
            fontSize={{ base: '3xl', sm: '4xl' }}
          >
            Built and used by leading academic institutes and companies
          </Heading>
          <Text fontSize='xl' color={'slate.700'} py='8' maxW='7xl' mx='auto'>
            Unikraft's design, performance and security have been extensively developed, evaluated and put into production at leading companies and academic institutes.  The award-winning Unikraft research work has appeared in top-tier research and industry conferences.
          </Text>
        </Box>
        <SimpleGrid columns={{
          base: 1,
          sm: 2,
          md: 3,
          xl: 5,
        }}>
          <Logo><UniLancs /></Logo>
          <Logo><UniManchester /></Logo>
          <Logo><UniUPB height="50%" /></Logo>
          <Logo><UniKIT /></Logo>
          <Logo><UniLiege /></Logo>
          <Logo><CompanyNEC /></Logo>
          <Logo><CompanyARM /></Logo>
          <Logo><CompanyOpensynergy /></Logo>
          <Logo><UniTexas /></Logo>
          <Logo><UniICL /></Logo>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
