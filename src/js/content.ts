function getIntroKey(showname: string): string {
  return `${showname}-intro`;
}
function getOutroKey(showname: string): string {
  return `${showname}-outro`;
}

const nextEPQ =
  "#vjs_video_3 > div.vjs-control-bar > div > div.video-player-controls__aux-controls > div.d-flex.align-center.justify-center.next-panel > a";

function getShowname() {
  if (window.location.href.includes("https://www.funimation.com/v/")) {
    return window.location.href.split("/v/")[1].split("/")[0];
  }
  return "";
}

async function setCStorage(key: string, value: number | boolean) {
  await chrome.storage.sync.set({
    [key]: value,
  });
}

function contentScript(
  _maxQuality: boolean,
  _intro?: number,
  _outro?: number
) {
  const playerDuration =
    document.querySelector("video")?.duration ?? _outro;
  let introTime = _intro ?? 0;
  let outroTime = playerDuration;
  let isEnabled = true;
  let maxQuality = _maxQuality;

  // * Message Handler
  chrome.runtime.onMessage.addListener((req, _msgSender, respond) => {
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
          value: outroTime ?? -10,
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
        setCStorage("maxQuality", true);
        maxQuality = true;
        document.getElementById("input-111")?.click();
        break;
      }
      case "maxQuality-disable": {
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
  });

  // * Sync Storage Updates
  chrome.storage.onChanged.addListener((changes) => {
    for (const [key, { newValue }] of Object.entries(changes)) {
      const showname = getShowname();
      if (key === getIntroKey(showname)) introTime = newValue;
      else if (key === getOutroKey(showname)) outroTime = newValue;
      else if (key === "maxQuality") maxQuality = newValue;
    }
  });

  const pollingRate = 5000; // ms

  const timer = setInterval(() => {
    if (!isEnabled) return;
    if (maxQuality) document.getElementById("input-111")?.click();

    const playerTime = document.querySelector("video")?.currentTime;

    // ! Logic
    // Todo Show Skip Intro / Next Episode Card
    if (introTime && playerTime) {
      // ! Skip Intro Logic
      if (playerTime < introTime)
        document
          .querySelector("video")
          ?.setAttribute("currentTime", introTime.toString());
    }
    // ! Next Episode Logic
    if (outroTime && playerTime && outroTime > 20) {
      if (playerTime > outroTime) {
        const nextBTN = document.querySelector(nextEPQ) as HTMLElement;
        if (nextBTN) nextBTN.click();
      }
    }
  }, pollingRate);
  return () => clearInterval(timer);
}

function initCS() {
  console.log("Funimation Extended Loaded");
  const showname = getShowname();
  const introKey = getIntroKey(showname);
  const outroKey = getOutroKey(showname);

  chrome.storage.sync
    .get([introKey, outroKey, "maxQuality"])
    .then((value) => {
      if (!value[introKey]) {
        setCStorage(introKey, 0);
      }
      const vid_duration = document.querySelector("video")?.duration;
      if (!value[outroKey]) {
        // * Default Outro Time
        if (vid_duration) setCStorage(outroKey, vid_duration);
      }

      contentScript(
        value["maxQuality"] ?? false,
        value[introKey] ?? 0,
        value[outroKey] ?? vid_duration
      );
    });
}

initCS();
