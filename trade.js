// Create pob iframe
let pob = document.createElement('iframe')
pob.setAttribute('id', 'pob-iframe')
pob.setAttribute('src', 'https://pob.party/')
document.body.appendChild(pob)

// Inject code
let script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', chrome.extension.getURL('/trade-injected.js'))
document.body.appendChild(script)
