const deepMerge = require('deepmerge')
const defaultTheme = require('tailwindcss/defaultTheme');

var colors = {
	transparent: 'transparent',
	white: '#ffffff',
	black: '#000000',
  gray: {
		'50': '#f9fafb',
		'100': '#f4f5f7',
		'200': '#e5e7eb',
		'300': '#d5d6d7',
		'400': '#9e9e9e',
		'500': '#707275',
		'600': '#4c4f52',
		'700': '#24262d',
		'800': '#1a1c23',
		'900': '#121317',
	},
	'cool-gray': {
		'50': '#fbfdfe',
		'100': '#f1f5f9',
		'200': '#e2e8f0',
		'300': '#cfd8e3',
		'400': '#97a6ba',
		'500': '#64748b',
		'600': '#475569',
		'700': '#364152',
		'800': '#27303f',
		'900': '#1a202e',
	},
	red: {
		'50': '#fdf2f2',
		'100': '#fde8e8',
		'200': '#fbd5d5',
		'300': '#f8b4b4',
		'400': '#f98080',
		'500': '#f26f21',
		'600': '#e02424',
		'700': '#c81e1e',
		'800': '#9b1c1c',
		'900': '#771d1d',
	},
	orange: {
		'50':  '#fcfbf7',
		'100': '#faf0d4',
		'200': '#f5d8a8',
		'300': '#e5af74',
		'400': '#d68247',
		'500': '#e4681e', // secondary
		'600': '#a2461a',
		'700': '#7d3416',
		'800': '#562411',
		'900': '#37160b',
	},
	yellow: {
		'50': '#fdfdea',
		'100': '#fdf6b2',
		'200': '#fce96a',
		'300': '#faca15',
		'400': '#e3a008',
		'500': '#c27803',
		'600': '#9f580a',
		'700': '#8e4b10',
		'800': '#723b13',
		'900': '#633112',
	},
	green: {
		'50': '#f3faf7',
		'100': '#def7ec',
		'200': '#bcf0da',
		'300': '#84e1bc',
		'400': '#31c48d',
		'500': '#0e9f6e',
		'600': '#057a55',
		'700': '#046c4e',
		'800': '#03543f',
		'900': '#014737',
	},
	teal: {
		'50': '#edfafa',
		'100': '#d5f5f6',
		'200': '#afecef',
		'300': '#7edce2',
		'400': '#16bdca',
		'500': '#0694a2',
		'600': '#047481',
		'700': '#036672',
		'800': '#05505c',
		'900': '#014451',
	},
	blue: {
		'50':  '#f5f9fa',
		'100': '#e0f1fa',
		'200': '#bbe0f5',
		'300': '#89c0e6',
		'400': '#559bd2',
		'500': '#3f78be',
		'600': '#395177',
		'700': '#2a4682',
		'800': '#042f5f', // primary
		'900': '#111c3a',
	},
	indigo: {
		'50': '#f0f5ff',
		'100': '#e5edff',
		'200': '#cddbfe',
		'300': '#b4c6fc',
		'400': '#8da2fb',
		'500': '#6875f5',
		'600': '#5850ec',
		'700': '#5145cd',
		'800': '#42389d',
		'900': '#362f78',
	},
	purple: {
		'50': '#f6f5ff',
		'100': '#edebfe',
		'200': '#dcd7fe',
		'300': '#cabffd',
		'400': '#ac94fa',
		'500': '#9061f9',
		'600': '#7e3af2',
		'700': '#6c2bd9',
		'800': '#5521b5',
		'900': '#4a1d96',
	},
	pink: {
		'50': '#fdf2f8',
		'100': '#fce8f3',
		'200': '#fad1e8',
		'300': '#f8b4d9',
		'400': '#f17eb8',
		'500': '#e74694',
		'600': '#d61f69',
		'700': '#bf125d',
		'800': '#99154b',
		'900': '#751a3d',
	},
}

colors.blue.DEFAULT = colors.blue['600'];
colors.blue.dark = colors.blue['800'];
colors.primary = colors.blue;
colors.secondary = colors.orange;

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
		colors: colors,
    variables: {
      DEFAULT: {
        colors: colors
      }
    },
    fontFamily: {
      'display': ['"Inter", sans-serif'],
      'body': ['"Inter", sans-serif'],
      'sans': ['"Inter", sans-serif'],
    },
		screens: {
			xs: "475px",
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1329px"
    },
		extend: {
			columns: 24,
			gridTemplateColumns: {
				// Simple 24 column grid
				'24': 'repeat(24, minmax(0, 1fr))',
			},
			gridColumn: {
				'span-14': 'span 14 / span 14',
				'span-15': 'span 15 / span 15',
				'span-16': 'span 16 / span 16',
				'span-17': 'span 17 / span 17',
				'span-24': 'span 24 / span 24',
			}
		}
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@mertasan/tailwindcss-variables')({
      colorVariables: true
    })
  ],
}
