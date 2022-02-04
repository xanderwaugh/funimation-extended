import React from "react";
import { Box, ColorMode, Divider, useColorMode } from "@chakra-ui/react";
import { theme } from "./theme";

const Wrapper: React.FC = ({ children }) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      width={240}
      height={460}
      paddingX={"6px"}
      bgColor={colorMode === "light" ? theme.colors.brand.bg : "gray"}
    >
      {children}
    </Box>
  );
};

interface DividerProps {
  colorMode: ColorMode;
}

const CustomDivider: React.FC<DividerProps> = ({ colorMode }) => (
  <Divider
    my={".25rem"}
    borderColor={colorMode === "light" ? "gray" : "white"}
  />
);

export { Wrapper, CustomDivider };
