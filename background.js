chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  // console.log(details)
  if (details.url == "https://bbs.pku.edu.cn/v2/userstat.php") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["lib/d3.v7.js", "js/show.js"]
      })
      // chrome.tabs.sendMessage(tabs[0].id, { action: "userstat" }, function (response) {
      //   // console.log(response);
      // });
    });
  }
});
