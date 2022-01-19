import { getIntroKey, getOutroKey, setCStorage } from "../utils";
const nextEpQuery = ".d-flex .align-center .justify-center .next-panel";
// ! Stuff here
console.log("Content Script Loaded");

interface msgObj {
    action: string;
    value?: number;
}

const getShowname = (): string => {
    if (window.location.href.includes("https://www.funimation.com/v/")) {
        return window.location.href.split("/v/")[1].split("/")[0];
    } else {
        return "";
    }
};

window.addEventListener("load", () => {
    const showname = getShowname();
    const introKey = getIntroKey(showname);
    const outroKey = getOutroKey(showname);

    chrome.storage.sync.get([introKey, outroKey]).then((value) => {
        if (!value[introKey]) {
            setCStorage(introKey, 0);
        }
        if (!value[outroKey]) {
            const vid_duration = document.querySelector("video")?.duration;
            setCStorage(outroKey, vid_duration ? vid_duration : 99999999);
        }
        const introtime = value[introKey];
        const outrotime = value[outroKey];
        main(introtime, outrotime);
    });
});

// * Document Done Loading
const main = (_intro?: number, _outro?: number) => {
    const playerDuration = document.querySelector("video")?.duration;
    let introTime = _intro ?? 0;
    let isEnabled = true;

    // TODO Change to let
    const outroTime = _outro ?? playerDuration ?? 99999999;

    chrome.runtime.onMessage.addListener(
        (request: msgObj, sender, sendResponse) => {
            if (request.action === "getShowName") {
                sendResponse({
                    value: getShowname(),
                });
            } else if (request.action === "getPlayerTime") {
                const playerTime = document.querySelector("video")?.currentTime;
                sendResponse({
                    value: playerTime,
                });
            } else if (request.action === "getIntroTime") {
                sendResponse({
                    value: introTime,
                });
            } else if (request.action === "getOutroTime") {
                sendResponse({
                    value: outroTime,
                });
            } else if (request.action === "disable") {
                console.log("Funex Disabled");
                isEnabled = false;
            } else if (request.action === "enable") {
                console.log("Funex Enabled");
                isEnabled = true;
            }
        }
    );
    console.log("Content Script Ready");

    chrome.storage.onChanged.addListener((changes) => {
        for (const [_, { oldValue, newValue }] of Object.entries(changes)) {
            // TODO Fix This
            introTime = newValue;
        }
    });

    // Iterate every second
    const timer = setInterval(() => {
        if (!isEnabled) {
            return;
        }

        const playerTime = document.querySelector("video")?.currentTime;
        if (introTime && playerTime) {
            // ! Check if player is before intro time
            if (playerTime < introTime) {
                // Todo SKIP or Add Skip Intro Button
                console.log("Skipping Intro...");
                document.querySelector("video")!.currentTime = introTime;
            }
            // ! Check if player is after Outro Time
            if (playerTime > outroTime) {
                console.log("Skipping to Next Episode...");
                // Todo Show Next Episode Card
                const nextEp = document.querySelector<HTMLElement>(nextEpQuery);
                if (nextEp) {
                    nextEp.click();
                }
            }
        }
    }, 2000);
    return () => clearInterval(timer);
};
