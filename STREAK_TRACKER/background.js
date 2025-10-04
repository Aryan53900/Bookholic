chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'incrementTime' && request.targetUrl && request.dateKey) {
    addTimeForSiteDay(request.targetUrl, request.dateKey, request.seconds || 1);
    sendResponse({ success: true });
  }
  return true;
});
async function addTimeForSiteDay(url, dateKey, seconds) {
  const data = await chrome.storage.local.get(['timeStreaks']);
  let timeStreaks = data.timeStreaks || {};
  if (!timeStreaks[url]) timeStreaks[url] = {};
  timeStreaks[url][dateKey] = (timeStreaks[url][dateKey] || 0) + seconds;
  await chrome.storage.local.set({ timeStreaks });
}
