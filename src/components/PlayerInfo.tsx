import * as React from "react";
import { Heading, HStack } from "@chakra-ui/react";
import { formatTime } from "../utils";

interface PlayerInfo {
    showname?: string;
    playerTime?: number;
}

const PlayerInfo: React.FC<PlayerInfo> = ({ showname, playerTime }) => {
    let formattedShowName: string | undefined;
    if (showname?.includes("-")) {
        formattedShowName = showname.replace("-", " ");
    } else {
        formattedShowName = showname;
    }

    return (
        // * Player Controls */
        <HStack
            mx="auto"
            border="1px solid"
            borderColor={"gray"}
            shadow="lg"
            rounded={"lg"}
            px={2}
        >
            <Heading fontSize={"md"}>{formattedShowName}</Heading>
            <Heading fontSize={"md"}>
                Time {playerTime ? formatTime(playerTime) : "00:00"}
            </Heading>
        </HStack>
    );
};

export { PlayerInfo };
