document.addEventListener('DOMContentLoaded', function () {
  let code = document.getElementById('code')
  let message = document.getElementById('message')

  document.getElementById('set_build_code_button').addEventListener('click', e => {
    chrome.runtime.sendMessage({'message': 'set_build_code', 'code': code.value})
  })

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message == 'message') {
      message.className = request.type
      message.innerHTML = request.content
    } else if (request.message == 'code') {
      code.value = request.code
    }
  })

  chrome.runtime.sendMessage({'message': 'get_message'})
  chrome.runtime.sendMessage({'message': 'get_build_code'})
})
