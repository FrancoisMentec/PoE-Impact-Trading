// Inject code
let script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
script.setAttribute('src', chrome.extension.getURL('js/pob-injected.js'))
document.body.appendChild(script)

/*setTimeout(() => {
  chrome.storage.sync.get(['build_code'], res => {
    if (typeof res.build_code == 'string') {
      console.log('import_build')
      window.postMessage({
        message: 'import_build',
        code: res.build_code
      }, '*')
    } else {
      console.log('No build code defined')
    }
  })
}, 1000)*/
