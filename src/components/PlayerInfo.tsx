import React from "react";
import { Text, HStack } from "@chakra-ui/react";
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
    <HStack mx="auto" border="1px solid" borderColor={"gray"} px={1}>
      <Text fontSize={"md"}>{formattedShowName}</Text>
      <Text fontSize={"md"}>
        Time <br />
        {playerTime ? formatTime(playerTime) : "00:00"}
      </Text>
    </HStack>
  );
};

export { PlayerInfo };
