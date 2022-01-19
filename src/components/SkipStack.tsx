import * as React from "react";
import { VStack, Button, Heading } from "@chakra-ui/react";
import { formatTime } from "../utils";

interface CompProps {
    btn: string;
    timeTitle: string;
    timeValue: number | undefined;
    isLoading: boolean;
    btnEvent: React.MouseEventHandler<HTMLButtonElement>;
}

const SkipStack: React.FC<CompProps> = ({
    btn,
    timeTitle,
    timeValue,
    isLoading,
    btnEvent,
}) => {
    return (
        <VStack mx="auto" textAlign={"center"}>
            <Button
                size="md"
                colorScheme={"twitter"}
                onClick={btnEvent}
                isLoading={isLoading}
                shadow="md"
            >
                {btn}
            </Button>
            <Heading fontSize={"md"}>
                {timeTitle} <br />
                {timeValue ? formatTime(timeValue) : "00:00"}
            </Heading>
        </VStack>
    );
};

export { SkipStack };
