chrome.runtime.onInstalled.addListener((details) => {
  //   const currentVersion = chrome.runtime.getManifest().version;
  //   const previousVersion = details.previousVersion;
  const reason = details.reason;

  switch (reason) {
    case "install":
      chrome.runtime.openOptionsPage();
      break;
    case "update":
      break;
    case "chrome_update":
    case "shared_module_update":
    default:
      console.log("Other install events within the browser");
      break;
  }
});
