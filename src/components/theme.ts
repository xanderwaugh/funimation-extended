import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";
import "@fontsource/allerta";

const theme = extendTheme(
  {
    colors: {
      brand: {
        bg: "#FFF",
        primary: "#00335d",
      },
    },
    fonts: {
      mono: "Allerta",
      heading: "Allerta",
    },
    breakpoints: createBreakpoints({
      sm: "40em",
      md: "52em",
      lg: "64em",
      xl: "80em",
    }),
    config: {
      initialColorMode: "dark",
    },
  },
  withDefaultColorScheme({ colorScheme: "facebook" })
);

export { theme };
