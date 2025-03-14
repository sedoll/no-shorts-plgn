document.addEventListener("DOMContentLoaded", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url.includes("youtube.com")) {
    document.getElementById("toggle").disabled = true;
    document.getElementById("toggle").textContent = "유튜브에서만 동작";
    document.getElementById("status").textContent =
      "현재 페이지에서 지원되지 않음";
    return;
  }

  chrome.storage.sync.get("hiderActive", (data) => {
    const isActive = data.hiderActive ?? false;
    updatePopup(isActive);
  });

  document.getElementById("toggle").addEventListener("click", () => {
    chrome.storage.sync.get("hiderActive", (data) => {
      const newState = !data.hiderActive;
      chrome.storage.sync.set({ hiderActive: newState });

      // content.js에 메시지 전달 (동작 상태 변경)
      chrome.tabs.sendMessage(tab.id, { action: "toggle", state: newState });
      updatePopup(newState);
    });
  });
});

function updatePopup(isActive) {
  document.getElementById("toggle").textContent = isActive
    ? "비활성화"
    : "활성화";
  document.getElementById("status").textContent = `상태: ${
    isActive ? "ON" : "OFF"
  }`;
}
