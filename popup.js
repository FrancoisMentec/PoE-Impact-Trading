document.addEventListener('DOMContentLoaded', function () {
  let code = document.getElementById('code')
  let message = document.getElementById('message')


  function openPoB () {
    chrome.runtime.sendMessage({"message": "open_pob", "code": code.value})
  }
  document.getElementById('load_pob_button').addEventListener('click', openPoB)

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message == 'message') {
      message.className = request.type
      message.innerHTML = request.content
    }
  })

  chrome.runtime.sendMessage({'message': 'get_message'})
})
