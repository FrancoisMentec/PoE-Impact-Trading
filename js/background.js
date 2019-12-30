chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.create({url: 'https://www.pathofexile.com/trade/search/League'})
})
