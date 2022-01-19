import React from "react";
import { HStack, Switch, Text, VStack } from "@chakra-ui/react";

interface HeroProps {
    isEnabled?: boolean;
    clickEvent: React.MouseEventHandler<HTMLLabelElement>;
}

// Worlds Smallest Hero Card
const Hero: React.FC<HeroProps> = ({ isEnabled, clickEvent }) => {
    return (
        <HStack>
            <Text textAlign={"center"} fontSize={"md"}>
                Enhance all your watching experience!
            </Text>
            <VStack>
                <Switch
                    size="md"
                    colorScheme={"twitter"}
                    defaultChecked
                    border="1px solid"
                    borderColor={"gray"}
                    shadow={"md"}
                    onClick={clickEvent}
                />
                <Text>{isEnabled ? "Disabled" : "Enabled"}</Text>
            </VStack>
        </HStack>
    );
};

export { Hero };
