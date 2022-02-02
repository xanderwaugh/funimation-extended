chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("Service Worker Listening...");
  if (details.reason === "install") {
    await chrome.tabs.create({ url: "https://funext.net/thanks" });
  }
});

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  console.log(`Service Worker Received ${msg}. From ${sender}`);
  switch (msg.action) {
    case "ready":
      respond({
        data: "ready",
      });
      break;

    default:
      respond({
        data: "err",
      });
      break;
  }
});
