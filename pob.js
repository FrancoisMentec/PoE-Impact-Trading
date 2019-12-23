chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "hello") {
    alert('hello world')
  }
})

var script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', chrome.extension.getURL('/pob-injected.js'))
document.body.appendChild(script)
