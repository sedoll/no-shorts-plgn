// Shorts 및 특정 크기의 영상 숨기기
function hideShorts() {
  chrome.storage.sync.get("hiderActive", (data) => {
    if (!data.hiderActive) return; // 비활성화 상태면 실행 안 함

    // Shorts 영상 섹션 숨기기
    const elements = document.querySelectorAll(
      "ytd-rich-shelf-renderer, ytd-reel-shelf-renderer"
    );
    elements.forEach((el) => (el.style.display = "none"));

    // Shorts 메뉴 버튼 숨기기
    const shortsMenu = document.querySelector('a#endpoint[title="Shorts"]');
    if (shortsMenu) shortsMenu.style.display = "none";

    // 검색 결과에서 `SHORTS` 배지가 있는 영상 숨기기
    document.querySelectorAll("ytd-video-renderer").forEach((video) => {
      const badges = video.querySelectorAll("div.badge-shape-wiz__text");
      badges.forEach((badge) => {
        if (badge.textContent.trim().toUpperCase() === "SHORTS") {
          video.style.display = "none";
        }
      });
    });
  });
}

// Shorts 관련 요소를 다시 보이게 하는 함수
function showShorts() {
  // Shorts 영상 섹션
  const elements = document.querySelectorAll(
    "ytd-rich-shelf-renderer, ytd-reel-shelf-renderer"
  );
  elements.forEach((el) => (el.style.display = ""));

  // Shorts 메뉴 버튼
  const shortsMenu = document.querySelector('a#endpoint[title="Shorts"]');
  if (shortsMenu) shortsMenu.style.display = "";

  // 검색 결과에서 `SHORTS` 배지가 있는 영상
  document.querySelectorAll("ytd-video-renderer").forEach((video) => {
    video.style.display = "";
  });
}

// URL 변경 감지 (SPA 방식 대응)
function observeUrlChange(callback) {
  let lastUrl = location.href;
  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      callback();
    }
  }).observe(document.body, { childList: true, subtree: true });
}

// DOM 변경 감지 (Shorts 섹션 동적 로딩 대응)
const observer = new MutationObserver(hideShorts);

chrome.storage.sync.get("hiderActive", (data) => {
  if (data.hiderActive) {
    hideShorts();
    observer.observe(document.body, { childList: true, subtree: true });
  }
});

// URL 변경 감지하여 `hideShorts()` 실행
observeUrlChange(() => {
  chrome.storage.sync.get("hiderActive", (data) => {
    if (data.hiderActive) {
      hideShorts();
    }
  });
});

// popup.js에서 메시지를 받으면 실행/중지 토글
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggle") {
    const isActive = message.state;

    if (isActive) {
      hideShorts();
      observer.observe(document.body, { childList: true, subtree: true }); // Observer 시작
    } else {
      observer.disconnect(); // Observer 중지
      showShorts(); // Shorts 관련 요소 다시 표시
    }
  }
});
