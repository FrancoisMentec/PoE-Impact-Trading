let pob = null

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'open_pob') {
    chrome.tabs.create({'url': 'https://pob.party/'}, tab => {
      pob = tab
      chrome.tabs.sendMessage(pob.id, {'message': 'import', 'code': request.code})
    })
  } else if (request.message == 'get_item_impact') {
    if (pob == null) {
      message('PoB not found!', 'error')
    } else {
      chrome.tabs.sendMessage(pob.id, {'message': 'get_item_impact', 'text': request.text})
    }
  }
})

// Communication with the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == 'get_message' && _message != null) {
    chrome.runtime.sendMessage({'message': 'message', 'type': _message.type, 'content': _message.content})
  }
})

let _message = null
function message (content, type) {
  _message = {
    content: content,
    type: type
  }
  chrome.browserAction.setIcon({
      path: _message.type == 'error' ? 'error-38.png' : 'icon-38.png'
  })
  chrome.runtime.sendMessage({'message': 'message', 'type': _message.type, 'content': _message.content})
}
