import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { theme } from "./components/theme";
import { Popup } from "./Popup";

const Index: React.FC = () => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Popup />
    </ChakraProvider>
  );
};

ReactDOM.render(<Index />, document.getElementById("funex-root"));
