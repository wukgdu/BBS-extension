chrome.webNavigation.onHistoryStateUpdated.addListener(async function (details) {
  // console.log(details)
  if (details.url == "https://bbs.pku.edu.cn/v2/userstat.php") {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["lib/d3.v7.js", "js/show.js"]
    })
    // chrome.tabs.sendMessage(tabs[0].id, { action: "userstat" }, function (response) {
    //   // console.log(response);
    // });
  } else if (details.url.startsWith("https://bbs.pku.edu.cn/v2/post-read.php")) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["js/highlight_user.js"]
    })
  }
});
