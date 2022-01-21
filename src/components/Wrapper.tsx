import * as React from "react";
import { Box, useColorMode } from "@chakra-ui/react";
import { theme } from "./theme";

const Wrapper: React.FC = ({ children }) => {
    const { colorMode } = useColorMode();
    return (
        <Box
            width={240}
            height={400}
            paddingX={"6px"}
            bgColor={colorMode === "light" ? theme.colors.brand.bg : "gray"}
        >
            {children}
        </Box>
    );
};

export { Wrapper };
