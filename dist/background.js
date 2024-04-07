chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    chrome.storage.local.remove(`brightness_${tabId}`, () => {
      console.log(`Brightness data for tab ${tabId} removed from local storage.`);
    });
  });
  