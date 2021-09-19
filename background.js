chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  // console.log(details)
  if (details.url == "https://bbs.pku.edu.cn/v2/userstat.php") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["d3.v7.js", "show.js"]
      })
      // chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function (response) {
      //   console.log(response.farewell);
      // });
    });
  }
});
