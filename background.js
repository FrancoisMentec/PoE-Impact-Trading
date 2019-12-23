let pob = null

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "open_pob") {
    chrome.tabs.create({"url": "https://pob.party/"}, tab => {
      pob = tab
      chrome.tabs.sendMessage(tab.id, {"message": "hello"})
    })
  }
})
