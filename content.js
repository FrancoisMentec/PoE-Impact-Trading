let resultset = document.getElementsByClassName('resultset')[0]
console.log(resultset)
let items = resultset.getElementsByClassName('row')
console.log(items)

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      console.log('yolo2')
      //chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
    }
  }
)
