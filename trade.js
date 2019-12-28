let pob = null
let pobLink = null

function loadPob () { // Create pob iframe
  if (pobLink == null) throw new Error('PoB link is null')

  pob = document.createElement('iframe')
  pob.setAttribute('id', 'pob-iframe')
  pob.setAttribute('src', pobLink)
  document.body.appendChild(pob)
}

// Build User Interface
let controlPanel = document.createElement('div')
controlPanel.setAttribute('id', 'pte-control-panel')
document.body.appendChild(controlPanel)

let togglePanelButton = document.createElement('button')
togglePanelButton.setAttribute('id', 'toggle-panel-button')
togglePanelButton.className = 'pte-button'
togglePanelButton.innerHTML = 'Show'
togglePanelButton.addEventListener('click', e => {
  controlPanel.classList.toggle('visible')
  togglePanelButton.innerHTML = controlPanel.classList.contains('visible')
    ? 'Hide'
    : 'Show'
})
document.body.appendChild(togglePanelButton)

let toggleButton = document.createElement('button')
toggleButton.className = 'pte-button'
toggleButton.innerHTML = 'Disable PoE Trade Extension'
toggleButton.addEventListener('click', e => {
  if (pob == null) {
    loadPob()
  } else {
    document.body.removeChild(pob)
    pob = null
  }
  toggleButton.innerHTML = pob == null
    ? 'Enable PoE Trade Extension'
    : 'Disable PoE Trade Extension'
})
controlPanel.appendChild(toggleButton)

controlPanel.appendChild(document.createElement('br'))

let togglePobVisibleButton = document.createElement('button')
togglePobVisibleButton.className = 'pte-button'
togglePobVisibleButton.innerHTML = 'Show/Hide PoB'
togglePobVisibleButton.addEventListener('click', e => {
  if (pob != null) {
    pob.classList.toggle('visible')
  }
})
controlPanel.appendChild(togglePobVisibleButton)

// Get pob link, load pob and inject code
chrome.storage.sync.get(['build_code'], res => {
  if (typeof res.build_code == 'string') {
    pobLink = res.build_code
    loadPob()

    // Inject code
    let script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('src', chrome.extension.getURL('/trade-injected.js'))
    document.body.appendChild(script)
  } else {
    console.error('No build code defined')
  }
})
