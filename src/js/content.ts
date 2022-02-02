import { msgObj } from "./utils";

function getIntroKey(showname: string): string {
  return `${showname}-intro`;
}
function getOutroKey(showname: string): string {
  return `${showname}-outro`;
}
async function setCStorage(key: string, value: number | boolean) {
  await chrome.storage.sync
    .set({
      [key]: value,
    })
    .catch((reas) =>
      console.log(`Err Setting Key ${key}, reason: ${reas}`)
    );
}
function getShowname() {
  if (window.location.href.includes("https://www.funimation.com/v/")) {
    return window.location.href.split("/v/")[1].split("/")[0];
  } else {
    return "";
  }
}
function contentScript(_intro?: number, _outro?: number) {
  const playerDuration =
    document.querySelector("video")?.duration ?? _outro;
  let introTime = _intro ?? 0;
  let outroTime = playerDuration;
  let isEnabled = true;
  let maxQuality = false;
  chrome.storage.sync.get(["maxQuality"]).then((value) => {
    if (value["maxQuality"]) {
      maxQuality = true;
    } else {
      maxQuality = false;
    }
  });

  // Message Handler
  chrome.runtime.onMessage.addListener(
    (req: msgObj, _msgSender, respond) => {
      switch (req.action) {
        case "getShowName": {
          respond({
            value: getShowname(),
          });
          break;
        }
        case "getPlayerTime": {
          respond({
            value: document.querySelector("video")?.currentTime,
          });
          break;
        }
        case "getIntroTime": {
          respond({
            value: introTime,
          });
          break;
        }
        case "getOutroTime": {
          respond({
            value: outroTime ?? 1920,
          });
          break;
        }
        case "getVideoLength": {
          respond({
            value: document.querySelector("video")?.duration,
          });
          break;
        }
        case "disable": {
          console.log("Funex Disabled");
          isEnabled = false;
          break;
        }
        case "enable": {
          console.log("Funex Enabled");
          isEnabled = true;
          break;
        }
        case "maxQuality-enable": {
          console.log("1080p Enabled");
          setCStorage("maxQuality", true);
          maxQuality = true;
          document.getElementById("input-111")?.click();
          break;
        }
        case "maxQuality-disable": {
          console.log("1080p Disabled");
          maxQuality = false;
          setCStorage("maxQuality", false);
          break;
        }
        // ! Listen for content script call
        case "isOnFunimation": {
          respond({
            value: getShowname().length > 0,
          });
          break;
        }
        default: {
          respond({
            value: true,
          });
          break;
        }
      }
    }
  );

  // Listen for cstorage updates
  chrome.storage.onChanged.addListener((changes) => {
    for (const [key, { newValue }] of Object.entries(changes)) {
      const showname = getShowname();
      if (key === getIntroKey(showname)) {
        introTime = newValue;
      } else if (key === getOutroKey(showname)) {
        outroTime = newValue;
      } else if (key === "maxQuality") {
        maxQuality = newValue;
      }
    }
  });

  const pollingRate = 5000; // ms
  // Iterate every second
  const timer = setInterval(() => {
    if (!isEnabled) {
      return;
    }

    if (maxQuality) {
      document.getElementById("input-111")?.click();
    }

    const playerTime = document.querySelector("video")?.currentTime;
    if (introTime && playerTime) {
      // ! Check if player is before intro time
      if (playerTime < introTime) {
        // Todo SKIP or Add Skip Intro Button
        console.log("Skipping Intro...");
        // eslint-disable-next-line prefer-const
        let video = document.querySelector("video");
        if (video) video.currentTime = introTime;
      }
      // ! Check if player is after Outro Time
      if (outroTime && playerTime > outroTime) {
        console.log("Skipping to Next Episode...");
        // Todo Show Next Episode Card
        const nextEP: HTMLElement = document.getElementsByClassName(
          "hydra-video-next"
        )[0] as HTMLElement;
        nextEP.click();
      }
    }
  }, pollingRate);
  return () => clearInterval(timer);
}

function initCS() {
  console.log("Content Script Injected");
  const showname = getShowname();
  const introKey = getIntroKey(showname);
  const outroKey = getOutroKey(showname);

  chrome.storage.sync.get([introKey, outroKey]).then((value) => {
    if (!value[introKey]) {
      setCStorage(introKey, 0);
    }
    if (!value[outroKey]) {
      const vid_duration = document.querySelector("video")?.duration;
      // Set Default Video Duration
      if (vid_duration) setCStorage(outroKey, vid_duration);
    }
    const introtime = value[introKey];
    const outrotime = value[outroKey];
    contentScript(introtime, outrotime);
  });
}

initCS();
