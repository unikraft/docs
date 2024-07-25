import * as Chakra from '@chakra-ui/react'
import { JoinCommunityCards } from 'components/community-card'
import { LanguageLinks } from 'components/language-link'
import { Anchor } from 'components/mdx-components/anchor'
import { InlineCode } from 'components/mdx-components/inline-code'
import { LinkedHeading } from 'components/mdx-components/linked-heading'
import { Table, TData, THead, TRow } from 'components/mdx-components/table'
import NextImage from 'next/image'
import PropsTable from '../props-table'
import CodeBlock from './codeblock/codeblock'
import ComponentLinks from './component-links'
import { VideoPlayer } from './video-player'
import AsciinemaPlayer from 'components/asciinema-player'
import { UnikraftCloudBanner } from './unikraft-cloud-banner'

const {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AspectRatio,
  Box,
  chakra,
  Kbd,
  Link
} = Chakra

export const MDXComponents = {
  ...Chakra,
  Image: ({ ratio, border, src, title, description, maxW, bg, ...props }: any) => (
    <Box 
      my='5'
      mx='auto'
      maxW={maxW || undefined}
    >
      <Box
        p={border ? '4' : undefined}
        borderColor='slate.200'
        _dark={{
          borderColor: 'white'
        }}
        bg={bg || 'white'}
        rounded='md'
        borderWidth={border ? '1px' : undefined}
      >
        <AspectRatio
          ratio={ratio}
          >
          <NextImage
            src={src}
            alt={description}
            layout='fill'
            objectFit='contain'
            {...props}
          />
        </AspectRatio>
      </Box>
      {(description || title) && (
        <Box
          fontSize='sm'
          textColor='slate.500'
          pt='2'
        >
          {title && (<Box as='strong'>{title}</Box>)}
          {title && description && (<>:&nbsp;</>)}
          {description}
        </Box>
      )}
    </Box>
  ),
  LinkedImage: ({ href, ...props }) => (
    <Link display='block' my='10' href={href} isExternal>
      <MDXComponents.Image {...props} />
    </Link>
  ),
  h1: (props) => <chakra.h1 apply='mdx.h1' {...props} />,
  h2: (props) => <LinkedHeading apply='mdx.h2' {...props} />,
  h3: (props) => <LinkedHeading as='h3' apply='mdx.h3' {...props} />,
  h4: (props) => <LinkedHeading as='h4' apply='mdx.h4' {...props} />,
  hr: (props) => <chakra.hr apply='mdx.hr' {...props} />,
  strong: (props) => <Box as='strong' fontWeight='semibold' {...props} />,
  code: InlineCode,
  pre: (props) => <CodeBlock {...props} />,
  kbd: Kbd,
  br: ({ reset, ...props }) => (
    <Box
      as={reset ? 'br' : undefined}
      height={reset ? undefined : '24px'}
      {...props}
    />
  ),
  Table: Table,
  Th: THead,
  Tr: TRow,
  Td: TData,
  table: Table,
  th: THead,
  tr: TRow,
  td: TData,
  dd: TData,
  a: Anchor,
  p: (props) => <chakra.p apply='mdx.p' {...props} />,
  ul: (props) => <chakra.ul apply='mdx.ul' {...props} />,
  ol: (props) => <chakra.ol apply='mdx.ul' {...props} />,
  li: (props) => <chakra.li pb='4px' {...props} />,
  blockquote: (props) => (
    <Alert
      mt='4'
      role='none'
      status='warning'
      colorScheme='gray'
      variant='left-accent'
      as='blockquote'
      rounded='4px'
      my='1.5rem'
      {...props}
    />
  ),
  Info: ({children, title, ...props}) => {
    return (
      <Alert
        mt='4'
        role='none'
        status='info'
        variant='left-accent'
        as='blockquote'
        rounded='4px'
        my='1.5rem'
        {...props}
      >
        <AlertIcon />
        <Box>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>
            <chakra.div
              css={{
                '#codeblock > div': {
                  marginTop: '12px',
                  marginBottom: '6px',
                  borderRadius: '4px'
                }
              }}
            >
              {children}
            </chakra.div>
          </AlertDescription>
        </Box>
      </Alert>
    )
  },
  Warning: ({children, title, ...props}) => {
    return (
      <Alert
        mt='4'
        role='none'
        status='warning'
        variant='left-accent'
        as='blockquote'
        rounded='4px'
        my='1.5rem'
        {...props}
      >
        <AlertIcon />
        <Box>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>
            {children}
          </AlertDescription>
        </Box>
      </Alert>
    )
  },
  ComponentLinks,
  PropsTable,
  LanguageLinks,
  VideoPlayer,
  AspectRatio,
  UnikraftCloudBanner,
  JoinCommunityCards,
  FaqList: ({children, ...props}) => {
    return (
      <Accordion
        allowMultiple
        pt='8'
      >
        {children}
      </Accordion>
    )
  },
  AsciinemaPlayer,
  FaqItem: ({children, question, ...props}) => {
    return (
      <AccordionItem
        border={'solid 1px'}
        borderColor={'slate.300'}
        borderBottomWidth='0'
        _dark={{
          borderColor: 'slate.600'
        }}
        _first={{
          borderTopRadius: 'md'
        }}
        _last={{
          borderBottomRadius: 'md',
          borderBottomWidth: '1px'
        }}
      >
        <h2>
          <AccordionButton>
            <Box as="span" flex='1' fontWeight='bold' textAlign='left' py='2'>
              {question}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel sx={{
          'p:first-child': {
            marginTop: '0'
          }}
        }>
          {children}
        </AccordionPanel>
      </AccordionItem>
    )
  }
}
