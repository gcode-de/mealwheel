import { createGlobalStyle } from "styled-components";

import { Archivo } from "next/font/google";
export const archivo = Archivo({ subsets: ["latin"] });
import { Fira_Sans } from "next/font/google";
export const fira_sans = Fira_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
import { Abril_Fatface } from "next/font/google";
export const abril_fatface = Abril_Fatface({
  subsets: ["latin"],
  weight: ["400"],
});

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  :root {
    --color-background: #F5F5F5; 
    --color-shadow: #000000; 
    --color-highlight: #f0b000;
    --color-component: #FFFFFF;
    --color-darkgrey: #4D4A4A; 
    --color-lightgrey: #928F8F;
    --color-font: #1E1E1E;

    --font-header: ${fira_sans.style.fontFamily};
    --gap-out: 0.75rem; 
    --gap-between: 0.5rem; //halber Abstand
    --height-header: 5rem; 
    --height-nav: 4rem; 

    --border-radius-small: 10px;
    --border-radius-medium: 20px;
    --border-radius-large: 40px; 
  }
  body {
    margin: auto;
    font-family: ${archivo.style.fontFamily};
    max-width: 400px;
    background-color: var(--color-background);
    color: var(--color-font);
    padding-bottom: 69px;
    position: relative;
    input, button, select, option, a{color: var(--color-font)}

  }
`;
