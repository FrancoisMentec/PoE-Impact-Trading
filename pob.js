//if (parent === top) { // check we're in an iframe
  // Inject code
  let script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', chrome.extension.getURL('/pob-injected.js'))
  document.body.appendChild(script)
//}
