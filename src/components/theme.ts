import {
  extendTheme,
  ThemeConfig,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";
// import "@fontsource/allerta";

const myConfig: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const myBreakpoints = createBreakpoints({
  sm: "40em",
  md: "52em",
  lg: "64em",
  xl: "80em",
});

const fontConfig = {
  mono: "'Asap', sans-serif",
  body: "'Asap', sans-serif",
  heading: "'Asap', sans-serif",
};

const theme = extendTheme(
  {
    colors: {
      brand: {
        bg: "#FFF",
        primary: "#00335d",
      },
    },
    fonts: fontConfig,
    breakpoints: myBreakpoints,
    config: myConfig,
  },
  withDefaultColorScheme({ colorScheme: "facebook" })
);

export { theme };
