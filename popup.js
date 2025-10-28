const slider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");

slider.addEventListener("input", async () => {
  const speed = parseFloat(slider.value);
  speedValue.textContent = speed.toFixed(1) + "×";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Only run on YouTube video pages
  if (!tab.url.startsWith("https://www.youtube.com/watch")) return;

  // Inject script into the page to change speed
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (videoSpeed) => {
      // Wait for the video element if not loaded yet
      const video = document.querySelector("video");
      if (video) {
        video.playbackRate = videoSpeed;
      } else {
        // Retry after a short delay if video not found
        setTimeout(() => {
          const v = document.querySelector("video");
          if (v) v.playbackRate = videoSpeed;
        }, 200);
      }
    },
    args: [speed]
  });
});
