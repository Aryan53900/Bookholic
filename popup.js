document.getElementById('addUrlBtn').onclick = async () => {
  let url = document.getElementById('urlInput').value.trim();
  if (!url) return;
  if (!/^https?:\/\//.test(url)) url = 'https://' + url;
  await chrome.storage.local.set({ targetUrl: url });
  document.getElementById('urlLabel').textContent = url;
  location.reload();
};

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  let str = '';
  if (h) str += h + " h ";
  if (m) str += m + " min ";
  if (!h) str += s + " sec";
  return str.trim();
}

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

async function loadTodayTime() {
  const todayKey = getTodayKey();
  const { targetUrl='', timeStreaks={} } = await chrome.storage.local.get(['targetUrl', 'timeStreaks']);
  document.getElementById('urlLabel').textContent = targetUrl ? targetUrl : "No target set!";
  let seconds = 0;
  if (targetUrl && timeStreaks[targetUrl] && timeStreaks[targetUrl][todayKey])
    seconds = timeStreaks[targetUrl][todayKey];
  document.getElementById('todayTime').textContent = formatTime(seconds);
}
loadTodayTime();
