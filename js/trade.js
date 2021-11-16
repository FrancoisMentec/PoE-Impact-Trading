{
// Can't use synced storage for pob build code because they are too long
const storage = /Chrome/.test(navigator.userAgent)
  ? chrome.storage.sync
  : browser.storage.local
const manifest = /Chrome/.test(navigator.userAgent)
  ? chrome.runtime.getManifest()
  : browser.runtime.getManifest()
const POB_PARTY_REGEX = /^https:\/\/pob.party\/share\/[a-z]*$/
const POB_CODE_REGEX = /^([0-9A-z-=])+$/
let enabled = null // Whether the automatic impact computation is enabled or not
let pob = null
let script = null
let pobRegex = /^https:\/\/pob.party\/share\/[a-z]*$/
let icon = `<img src="${chrome.extension.getURL('img/icon-40.png')}">`
let errorIcon = `<img src="${chrome.extension.getURL('img/error-40.png')}">`

/**
 * Enable/Disable the impact computation
 * @param {boolean} value - If it should be enabled or not
 */
function toggle (value) {
  enabled = typeof value == 'boolean'
    ? value
    : !enabled

  window.postMessage({
    message: 'toggle',
    enabled: enabled
  })
}

/**
 * Add a title to the panel
 * @param {String} label - The title to add
 */
function addTitle (label) {
  let wrap = document.createElement('div')
  wrap.className = 'title-wrap'
  let title = document.createElement('div')
  title.className = 'title'
  title.innerText = label
  wrap.appendChild(title)
  controlPanel.appendChild(wrap)
}

/**
 * Add a setting to the panel
 * @param {String|Component} label - The label of the setting
 * @param {Component} input - The input of the setting
 */
function addSetting (label, input) {
  let wrap = document.createElement('div')
  wrap.className = 'setting-wrap'

  if (typeof label == 'string') {
    let temp = label
    label = document.createElement('label')
    label.className = 'pte-label'
    label.innerText = temp
  }
  wrap.appendChild(label)
  wrap.appendChild(input)
  controlPanel.appendChild(wrap)
}

// Handle communication
window.addEventListener('message', e => {
  if (e.data.message == 'message') {
    message(e.data.content, e.data.type, e.data.timeout, e.data.append)
  }
})

// Build User Interface
let controlPanel = document.createElement('div')
controlPanel.setAttribute('id', 'pte-control-panel')
document.body.appendChild(controlPanel)

let togglePanelButton = document.createElement('button')
togglePanelButton.setAttribute('id', 'toggle-panel-button')
togglePanelButton.className = 'pte-button'
//togglePanelButton.innerHTML = 'Show'
togglePanelButton.innerHTML = icon
togglePanelButton.addEventListener('click', e => {
  controlPanel.classList.toggle('visible')
  togglePanelButton.classList.toggle('visible')
  togglePanelButton.innerHTML = controlPanel.classList.contains('visible')
    ? '&times;'
    : icon
})
document.body.appendChild(togglePanelButton)

let panelTitle = document.createElement('div')
panelTitle.setAttribute('id', 'panel-title')
panelTitle.innerHTML = `${manifest.name} v${manifest.version}`
controlPanel.appendChild(panelTitle)

// The switch to enable/disable the extension (memorize the state)
let toggleSwitch = document.createElement('input')
toggleSwitch.setAttribute('type', 'checkbox')
toggleSwitch.className = 'switch'
controlPanel.appendChild(toggleSwitch)

let toggleLabel = document.createElement('label')
toggleLabel.innerText = 'Getting state...'
controlPanel.appendChild(toggleLabel)

toggleSwitch.addEventListener('change', e => {
  toggleLabel.innerText = toggleSwitch.checked
    ? 'Enabled'
    : 'Disabled'
  storage.set({ enabled: toggleSwitch.checked })
  toggle(toggleSwitch.checked)
})

addTitle('pob.party settings')

let togglePobVisibleButton = document.createElement('button')
togglePobVisibleButton.className = 'pte-button'
togglePobVisibleButton.innerHTML = 'Show PoB'
togglePobVisibleButton.addEventListener('click', e => {
  if (pob != null) {
    pob.classList.toggle('visible')
    pob.contentWindow.postMessage({
      message: 'set_visible',
      value: pob.classList.contains('visible')
    }, 'https://pob.party/')
    togglePobVisibleButton.innerHTML = pob.classList.contains('visible')
      ? 'Hide PoB'
      : 'Show PoB'
  } else {
    message('PoB is disabled', 'error', 5000)
  }
})
controlPanel.appendChild(togglePobVisibleButton)

// Go to pob.party
let pobLink = document.createElement('a')
pobLink.className = 'pte-button'
pobLink.setAttribute('target', '_blank')
pobLink.setAttribute('href', 'https://pob.party/')
pobLink.innerHTML = 'Open pob.party in a new tab'
controlPanel.appendChild(pobLink)

// PoB link input
let pobLinkInput = document.createElement('input')
pobLinkInput.className = 'pte-input'
pobLinkInput.setAttribute('placeholder', 'pob.party sharing link')
controlPanel.appendChild(pobLinkInput)

let pobLinkButton = document.createElement('button')
pobLinkButton.className = 'pte-button'
pobLinkButton.innerHTML = 'SET LINK'
pobLinkButton.addEventListener('click', e => {
  storage.set({build_code: pobLinkInput.value}, () => {
    setBuild(pobLinkInput.value)
    message('Build link set, you need to perform a new search to update the values.', 'message', 5000)
  })
})
controlPanel.appendChild(pobLinkButton)

addTitle('Impact settings')

// Color Scheme
let colorSchemes = {
  'Default': 'color_scheme_default',
  'Colorblind': 'color_scheme_1'
}
let _currentColorScheme = 'Default'
document.body.classList.add(colorSchemes[_currentColorScheme])
function setColorScheme (colorScheme, save=true) {
  if (colorScheme != _currentColorScheme) {
    document.body.classList.replace(colorSchemes[_currentColorScheme], colorSchemes[colorScheme])
    _currentColorScheme = colorScheme
    if (colorSchemeSelect.value != colorScheme) colorSchemeSelect.value = colorScheme
    if (save) {
      storage.set({color_scheme: colorScheme})
    }
    message(`Color Scheme set to "${colorScheme}"`, type='message', timeout=2000)
  }
}

let colorSchemeSelect = document.createElement('select')
colorSchemeSelect.classList.add('pte-select')
for (let colorScheme in colorSchemes) {
  let option = document.createElement('option')
  option.setAttribute('value', colorScheme)
  option.textContent = colorScheme
  colorSchemeSelect.appendChild(option)
}
colorSchemeSelect.addEventListener('change', e => {
  setColorScheme(colorSchemeSelect.value)
})

addSetting('Color Scheme', colorSchemeSelect)

storage.get(['color_scheme'], res => {
  if (typeof res.color_scheme != 'undefined') {
    setColorScheme(res.color_scheme, false)
  }
})

// Show PLayer/Minion
function setPlayerMinion (value, save=true) {
  document.body.classList.toggle('hide_player_impact', !/Player/.test(value))
  document.body.classList.toggle('hide_minion_impact', !/Minion/.test(value))
  if (playerMinionSelect.value != value) playerMinionSelect.value = value
  if (save) {
    storage.set({player_minion: value})
  }
}

let playerMinionSelect = document.createElement('select')
playerMinionSelect.classList.add('pte-select')
playerMinionSelect.innerHTML = `
  <option value="PlayerMinion">Player and Minion</option>
  <option value="Player">Player only</option>
  <option value="Minion">Minion only</option>
`
playerMinionSelect.addEventListener('change', e => setPlayerMinion(playerMinionSelect.value))

storage.get(['player_minion'], res => {
  if (typeof res.player_minion != 'undefined') {
    setPlayerMinion(res.player_minion, false)
  }
})

addSetting('Show impact on', playerMinionSelect)

/* Filter
 * Filter items for which replacement impact should be shown
 * Useful for jewels and rings
 */
let filterInput = document.createElement('input')
filterInput.className = 'pte-input'
filterInput.setAttribute('placeholder', '#2, circle of guilt, ...')

storage.get(['filter'], res => {
  if (res.filter) filterInput.value = res.filter
})

filterInput.addEventListener('change', e => {
  message(`Filter set to "${filterInput.value}", make a new search to update.`, 'message', 3000)

  window.postMessage({
    message: 'filter',
    filter: filterInput.value
  })

  storage.set({ filter: filterInput.value })
})

addSetting('Filter', filterInput)

// Message
let messageDiv = document.createElement('div')
messageDiv.setAttribute('id', 'pte-message')
controlPanel.appendChild(messageDiv)

let messageTimeout = null
function message (content, type='message', timeout=null, append=false) {
  clearTimeout(messageTimeout)

  messageDiv.className = type

  if (append) {
    if (messageDiv.innerHTML.length > 0) messageDiv.innerHTML += '<br>'
    messageDiv.innerHTML += content
  } else {
    messageDiv.innerHTML = content
  }

  if (type == 'error') {
    console.error(content)
    if (!controlPanel.classList.contains('visible')) togglePanelButton.innerHTML = errorIcon
  } else {
    console.log(content)
  }

  if (timeout != null) {
    messageTimeout = setTimeout(() => {
      messageDiv.className = ''
      messageDiv.innerHTML = ''
    }, timeout)
  }
}

// Footer
let githubLogo = `<svg class="octicon octicon-mark-github v-align-middle" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" fill="white" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>`

let footer = document.createElement('div')
footer.innerText = 'Made with ❤ by François Mentec on'

let githubLink = document.createElement('a')
githubLink.setAttribute('id', 'github-link')
githubLink.setAttribute('target', '_blank')
githubLink.setAttribute('href', 'https://github.com/FrancoisMentec/PoE-Trade-Extension')
githubLink.innerHTML = githubLogo + 'GitHub'
footer.appendChild(githubLink)

controlPanel.appendChild(footer)

// Get pob link, load pob and inject code
async function loadPob (src='https://pob.party') { // Create pob iframe
  if (pob != null) unloadPob() // unload current pob first

  pobLink.setAttribute('href', src)

  pob = document.createElement('iframe')
  pob.setAttribute('id', 'pob-iframe')
  pob.setAttribute('src', src)
  document.body.appendChild(pob)
}

function unloadPob () {
  document.body.removeChild(pob)
  pob = null
}

function injectCode (enabled=true, filter='') {
  if (script != null) return
  script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', chrome.extension.getURL('js/trade-injected.js'))
  script.setAttribute('enabled', enabled)
  script.setAttribute('filter', filter)
  document.body.appendChild(script)
}

/**
 * Set The build
 * @param {String} build_code - Can be a pob.party sharing link, or a pob code
 */
function setBuild (build_code) {
  if (build_code.match(POB_PARTY_REGEX)) { // Sharing link
    loadPob(build_code)
  } else {
    if (!pob) loadPob()
    if (build_code.match(POB_CODE_REGEX)) {
      console.log('send message')
      pob.contentWindow.postMessage({
        message: 'set_build',
        build_code: build_code
      })
    } else {
      message('build code is invalid, it must be a pob export code or a pob.party sharing link.', 'error')
    }
  }
}

// initialize
storage.get(['build_code', 'enabled', 'filter'], res => {
  if (res.build_code) {
    pobLinkInput.value = res.build_code
    setBuild(res.build_code)
  } else {
    loadPob() // Load pob anyway so it's done if the user give a pob code and ressources will be cached
    message('pob.party link is not defined', 'error')
  }

  enabled = typeof res.enabled == 'undefined' || res.enabled
  injectCode(enabled, res.filter || '')
  toggleSwitch.checked = enabled
  toggleLabel.innerText = enabled
    ? 'Enabled'
    : 'Disabled'
})
}
