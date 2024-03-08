import { createGlobalStyle } from "styled-components";
import { Archivo } from "next/font/google";

const archivo = Archivo({ subsets: ["latin"], weight: "400" });

archivo.style.fontFamily;

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  :root {
    --color-background: #F5F5F5; 
    --color-shadow: #000000; 
    --color-highlight: #DF3F3F;
    --color-component: #FFFFFF;
    --color-darkgrey: #4D4A4A; 
    --color-lightgrey: #928F8F;
    --color-font: #1E1E1E;

    --gap-out: 2rem; 
    --gap-between: 0.5rem; //halber Abstand
    --height-header: 4rem; 
    --height-nav: 4rem; 

    --border-radius-small: 10px;
    --border-radius-medium: 20px;
    --border-radius-large: 40px; 
  }
  body {
    margin: auto;
    font-family: "archivo", sans-serif;
    /* font-weight: semi-bold; */
    max-width: 400px;
    background-color: var(--color-background);
    color: var(--color-font);
    padding-bottom: 5rem;
    position: relative;
  }
`;
