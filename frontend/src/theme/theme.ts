import { createTheme } from '@mui/material/styles';
export const makeTheme = (mode:'light'|'dark') => createTheme({ palette:{ mode, primary:{main:'#8d3b2f'}, secondary:{main:'#d9a441'} }, shape:{ borderRadius:14 }, typography:{ fontFamily:'Roboto, sans-serif' } });
