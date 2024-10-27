import flowbite from "flowbite-react/tailwind";
import type { Config } from "tailwindcss";
import { amber, black, cyan, emerald, gray, green, lime, orange, red, slate, teal, white } from "tailwindcss/colors"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: black,
      red: red,
      green: green,
      orange: orange,
      white: white,
      gray: gray,
      slate: slate,
      teal: teal,
      lime: lime,
      amber: amber,
      emerald: emerald,
      yellow: amber,
      "verde": {
        '50': '#f4f8ed',
        '100': '#e7efd8',
        '200': '#d0e1b5',
        '300': '#b1cc8a',
        '400': '#94b764',
        '500': '#769c46',
        '600': '#5a7b35',
        '700': '#4a642e',
        '800': '#3a4d27',
        '900': '#344225',
        '950': '#192310',
      },

      'amarillo': {
        '50': '#fcfee8',
        '100': '#f9ffc2',
        '200': '#f8ff88',
        '300': '#fbff45',
        '400': '#fdf712',
        '500': '#f2e205',
        '600': '#cdaf01',
        '700': '#a37e05',
        '800': '#87630c',
        '900': '#725011',
        '950': '#432b05',
      },
    },
    extend: {},
  },
  plugins: [flowbite.plugin()],
};
export default config;
