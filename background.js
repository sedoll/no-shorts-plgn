chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ hiderActive: false });
});
