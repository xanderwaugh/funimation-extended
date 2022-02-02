const manifest: chrome.runtime.ManifestV3 = {
  name: "Funimation Extended",
  manifest_version: 3,
  version: "2.2.3",
  background: {
    service_worker: "js/background.ts",
  },
  icons: {
    "16": "assets/images/logo_16.png",
    "32": "assets/images/logo_32.png",
    "48": "assets/images/logo_48.png",
    "128": "assets/images/logo_128.png",
  },
  permissions: ["activeTab", "storage"],
  host_permissions: ["*://*.funimation.com/*"],
  content_scripts: [
    {
      js: ["js/content.ts"],
      matches: ["*://*.funimation.com/*"],
    },
  ],
  action: {
    default_popup: "popup/index.html",
    default_title: "Open Funimation Extended",
    default_icon: {
      "16": "assets/images/logo_16.png",
      "32": "assets/images/logo_32.png",
      "48": "assets/images/logo_48.png",
      "128": "assets/images/logo_128.png",
    },
  },
  web_accessible_resources: [
    {
      resources: ["js/content.ts"],
      matches: ["*://*.funimation.com/*"],
    },
  ],
};

export default manifest;
