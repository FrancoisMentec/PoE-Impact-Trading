// Create pob iframe
let pob = document.createElement('iframe')
pob.setAttribute('id', 'pob-iframe')
//pob.setAttribute('src', 'https://pob.party/share/ohasikayoatono')
document.body.appendChild(pob)

chrome.storage.sync.get(['build_code'], res => {
  if (typeof res.build_code == 'string') {
    pob.setAttribute('src', res.build_code)

    // Inject code
    let script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', chrome.extension.getURL('/trade-injected.js'))
    document.body.appendChild(script)
  } else {
    console.log('No build code defined')
  }
})
