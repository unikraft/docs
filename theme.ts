import { extendTheme } from '@chakra-ui/react'
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "./tailwind.config";

const tailwind = resolveConfig(tailwindConfig);
import type { StyleFunctionProps } from '@chakra-ui/styled-system'

const customTheme = extendTheme({
  config: {},
  semanticTokens: {
    colors: {
      'ukblue': {
        default: '#0D1934',
        50: '#C1CFEF',
        100: '#B0C3EB',
        200: '#90A9E3',
        300: '#6F90DB',
        400: '#4F77D3',
        500: '#3260C7',
        600: '#2A50A6',
        700: '#214086',
        800: '#193165',
        900: '#112144',
        950: '#0D1934',
      },
      'slate': {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
      },
      green: {
        50: '#f3faf7',
        100: '#def7ec',
        200: '#bcf0da',
        300: '#84e1bc',
        400: '#31c48d',
        500: '#0e9f6e',
        600: '#057a55',
        700: '#046c4e',
        800: '#03543f',
        900: '#014737',
      },
      // accent semantic tokens
      accent: { default: 'ukblue.400', _dark: 'ukblue.300' },
      'accent-emphasis': { default: 'ukblue.700', _dark: 'ukblue.200' },
      'accent-static': 'ukblue.500',
      'accent-muted': { default: 'ukblue.300', _dark: 'ukblue.200' },
      'accent-subtle': { default: 'ukblue.50', _dark: 'ukblue.800' },
      // foreground semantic tokens
      fg: { default: 'gray.700', _dark: 'gray.100' },
      'fg-emphasis': { default: 'gray.900', _dark: 'gray.200' },
      'fg-muted': { default: 'gray.600', _dark: 'gray.400' },
      'fg-subtle': { default: 'gray.500', _dark: 'gray.300' },
      'fg-on-accent': { default: 'white', _dark: 'inherit' },
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        color: 'fg',
        '.deleted': {
          color: '#ff8383 !important',
          fontStyle: 'normal !important',
        },
        bg: props.colorMode === 'dark' ? '#070D1C' : 'slate.100',
        '.inserted': {
          color: '#b5f4a5 !important',
          fontStyle: 'normal !important',
        },
      },
    }),
  },
  textStyles: {
    heading: {
      fontFamily: 'heading',
      textAlign: 'center',
      fontWeight: 'bold',
      letterSpacing: '-0.015em',
      lineHeight: '1.24',
      fontSize: { base: '2rem', md: '3.5rem' },
    },
    'heading-2': {
      fontFamily: 'heading',
      textAlign: 'center',
      fontWeight: 'bold',
      letterSpacing: '-0.015em',
      lineHeight: '1.24',
      fontSize: { base: '1.75rem', md: '2.75rem' },
    },
    caps: {
      textTransform: 'uppercase',
      fontSize: 'sm',
      letterSpacing: 'widest',
      fontWeight: 'bold',
    },
  },
  mdx: {
    h1: {
      mt: '2rem',
      mb: '.25rem',
      lineHeight: 1.2,
      fontWeight: 'bold',
      fontSize: '1.875rem',
      letterSpacing: '-.025em',
    },
    h2: {
      mt: '2rem',
      mb: '0.5rem',
      lineHeight: 1.3,
      fontWeight: 'semibold',
      fontSize: '1.5rem',
      letterSpacing: '-.025em',
      '& + h3': {
        mt: '1.5rem',
      },
    },
    h3: {
      mt: '1rem',
      lineHeight: 1.25,
      fontWeight: 'semibold',
      fontSize: '1.25rem',
      letterSpacing: '-.025em',
    },
    h4: {
      mt: '1rem',
      lineHeight: 1.375,
      fontWeight: 'semibold',
      fontSize: '1.125rem',
    },
    a: {
      color: 'accent',
      fontWeight: 'semibold',
      transition: 'color 0.15s',
      transitionTimingFunction: 'ease-out',
      _hover: {
        color: 'ukblue.600',
      },
    },
    p: {
      mt: '1.25rem',
      lineHeight: 1.7,
      'blockquote &': {
        mt: 0,
      },
    },
    hr: {
      my: '4rem',
    },
    blockquote: {
      bg: 'orange.100',
      borderWidth: '1px',
      borderColor: 'orange.200',
      rounded: 'lg',
      px: '1.25rem',
      py: '1rem',
      my: '1.5rem',
    },
    ul: {
      mt: '0.5rem',
      ml: '1.25rem',
      'blockquote &': { mt: 0 },
      '& > * + *': {
        mt: '0.25rem',
      },
    },
    code: {
      rounded: 'sm',
      px: '1',
      fontSize: '0.875em',
      py: '2px',
      lineHeight: 'normal',
    },
  },
})

export default customTheme
