chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == 'set_build_code') {
    chrome.storage.sync.set({build_code: request.code}, () => {
      message('Build code set at ' + (new Date()), 'message')
    })
  } else if (request.message == 'get_build_code') {
    chrome.storage.sync.get(['build_code'], r => {
      chrome.runtime.sendMessage({'message': 'code', 'code': r.build_code || ''})
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
      path: _message.type == 'error' ? 'img/error-38.png' : 'img/icon-38.png'
  })
  chrome.runtime.sendMessage({'message': 'message', 'type': _message.type, 'content': _message.content})
}
