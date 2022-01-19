import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
    ChakraProvider,
    Heading,
    VStack,
    Divider,
    HStack,
    Switch,
    Text,
} from "@chakra-ui/react";
import {
    sendAction,
    sendActionCB,
    getIntroKey,
    setCStorage,
    getOutroKey,
} from "./utils";
import { theme } from "./components/theme";
import { SkipStack } from "./components/SkipStack";
import { Wrapper } from "./components/Wrapper";
import { PlayerInfo } from "./components/PlayerInfo";

const App: React.FC = () => {
    // ! Enable / Disable Extension Controlling Funimation
    const [isEnabled, setEnabled] = useState(true);
    const [showName, setShowName] = useState("");
    const [playerTime, setPlayerTime] = useState<number | undefined>();
    const [introTime, setIntroTime] = useState<number | undefined>();
    // * Setting Outro Skip Time
    const [outroTime, setOutroTime] = useState<number | undefined>();

    // * Smooth Button Animations
    const [introBtnLoading, setIntroLoading] = useState(false);
    const [outroBtnLoading, setOutroLoading] = useState(false);

    // * Called on Inital Popup Load
    useEffect(() => {
        // ? Initial Things - Dont Need Timer
        // * IntroTime & OutroTime
        sendActionCB("getShowName", setShowName);
        sendActionCB("getIntroTime", setIntroTime);
        sendActionCB("getOutroTime", setOutroTime);

        // ! Update Every Sec
        const interval = setInterval(() => {
            // ? Call Content Script for Player Time
            sendActionCB("getPlayerTime", setPlayerTime);
        }, 1000);
        return () => clearInterval(interval);
    }, [showName, playerTime, introTime, outroTime]);

    return (
        <Wrapper>
            <VStack mx="auto" divider={<Divider borderColor="gray" />}>
                <VStack spacing={0}>
                    <Heading lineHeight={"1"}>Funimation</Heading>
                    <Heading lineHeight={"1"}>Extended</Heading>
                </VStack>
                {/* HERO */}
                <HStack>
                    <Text textAlign={"center"} fontSize={"md"}>
                        Enhance all your watching experience!
                    </Text>
                    <VStack>
                        <Switch
                            defaultChecked={true}
                            size="lg"
                            colorScheme={"twitter"}
                            shadow={"md"}
                            onChange={() => {
                                setEnabled(!isEnabled);
                                sendAction(isEnabled ? "enable" : "disable");
                            }}
                        />
                        <Text fontSize={"1rem"}>
                            {isEnabled ? "Enabled" : "Disabled"}
                        </Text>
                    </VStack>
                </HStack>
                {/* <Hero
                    isEnabled={isEnabled}
                    clickEvent={() => {
                        setEnabled(!isEnabled);
                        sendAction(isEnabled ? "enable" : "disable");
                    }}
                /> */}

                {/* // * Player Controls */}
                <PlayerInfo showname={showName} playerTime={playerTime} />

                {/* // * Intro Skipping */}
                <SkipStack
                    btn="Set Intro Skip"
                    timeTitle="Intro Time"
                    timeValue={introTime}
                    isLoading={introBtnLoading}
                    btnEvent={() => {
                        if (!playerTime) return;
                        setIntroLoading(true);
                        setIntroTime(playerTime);
                        const introKey = getIntroKey(showName);
                        setCStorage(introKey, playerTime);
                        setTimeout(() => {
                            setIntroLoading(false);
                        }, 1000);
                    }}
                />

                {/* Outro Skipping */}
                <SkipStack
                    btn="Set Outro Next ep."
                    timeTitle="Outro Time"
                    timeValue={outroTime}
                    isLoading={outroBtnLoading}
                    btnEvent={() => {
                        if (!playerTime) return;
                        setOutroLoading(true);
                        setOutroTime(playerTime);
                        const outroKey = getOutroKey(showName);
                        setCStorage(outroKey, playerTime);
                        setTimeout(() => {
                            setOutroLoading(false);
                        }, 1000);
                    }}
                />
            </VStack>
        </Wrapper>
    );
};

ReactDOM.render(
    <ChakraProvider resetCSS theme={theme}>
        <App />
    </ChakraProvider>,
    document.getElementById("funnex-root-node")
);
