import * as React from "react";
import { Box } from "@chakra-ui/react";
import { theme } from "./theme";

const Wrapper: React.FC = ({ children }) => {
    return (
        <Box
            width={240}
            height={400}
            paddingX={"6px"}
            bgColor={theme.colors.brand.bg}
        >
            {children}
        </Box>
    );
};

export { Wrapper };
