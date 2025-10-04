let trackingUrl = "";
chrome.storage.local.get('targetUrl', data => { trackingUrl = data.targetUrl || ""; });
chrome.storage.onChanged.addListener((changes) => {
  if (changes.targetUrl) trackingUrl = changes.targetUrl.newValue;
});

let timerInterval = null;
function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}
function matchUrl(current, target) {
  try {
    const cur = new URL(current), tgt = new URL(target); return cur.hostname === tgt.hostname;
  } catch { return false; }
}
function startTimer() {
  if (!timerInterval) timerInterval = setInterval(() => {
    if (trackingUrl && matchUrl(window.location.href, trackingUrl)) {
      chrome.runtime.sendMessage({ action: 'incrementTime', targetUrl: trackingUrl, dateKey: getTodayKey(), seconds: 1 });
    }
  }, 1000);
}
function stopTimer() { if (timerInterval) clearInterval(timerInterval), timerInterval = null; }
document.addEventListener('visibilitychange', () => { !document.hidden ? startTimer() : stopTimer(); });
if (!document.hidden) startTimer();
window.addEventListener('beforeunload', stopTimer);
