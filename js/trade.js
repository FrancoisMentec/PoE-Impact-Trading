{
let storage = chrome.storage.sync
let pob = null
let script = null
let pobRegex = /^https:\/\/pob.party\/share\/[a-z]*$/
let icon = `<img src="${chrome.extension.getURL('img/icon-40.png')}">`
let errorIcon = `<img src="${chrome.extension.getURL('img/error-40.png')}">`

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
  togglePanelButton.innerHTML = controlPanel.classList.contains('visible')
    ? '&times;'
    : icon
})
document.body.appendChild(togglePanelButton)

let panelTitle = document.createElement('div')
panelTitle.setAttribute('id', 'panel-title')
panelTitle.innerHTML = 'PoE Trade Extension'
controlPanel.appendChild(panelTitle)

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

controlPanel.appendChild(document.createElement('br'))

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
    message('Build link set: ' + pobLinkInput.value, 'message', 5000)
    loadPob()
  })
})
controlPanel.appendChild(pobLinkButton)

// Message
let messageDiv = document.createElement('div')
messageDiv.setAttribute('id', 'pte-message')
controlPanel.appendChild(messageDiv)

function message (content, type='message', timeout=null) {
  messageDiv.className = type
  messageDiv.innerHTML = content

  if (type == 'error') {
    console.error(content)
    if (!controlPanel.classList.contains('visible')) togglePanelButton.innerHTML = errorIcon
  } else {
    console.log(content)
  }

  if (timeout != null) {
    setTimeout(() => {
      messageDiv.className = ''
      messageDiv.innerHTML = ''
    }, timeout)
  }
}

let githubLogo = `<svg class="octicon octicon-mark-github v-align-middle" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" fill="white" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>`

let githubLink = document.createElement('a')
githubLink.setAttribute('id', 'github-link')
githubLink.setAttribute('target', '_blank')
githubLink.setAttribute('href', 'https://github.com/FrancoisMentec/PoE-Trade-Extension')
githubLink.innerHTML = githubLogo + 'GitHub'
controlPanel.appendChild(githubLink)

// Get pob link, load pob and inject code
function loadPob () { // Create pob iframe
  storage.get(['build_code'], res => {
    if (typeof res.build_code == 'string') {
      if (res.build_code.match(/^https:\/\/pob.party\/share\/[a-z]*$/) != null) {
        pobLinkInput.value = res.build_code

        pob = document.createElement('iframe')
        pob.setAttribute('id', 'pob-iframe')
        pob.setAttribute('src', res.build_code)
        document.body.appendChild(pob)

        injectCode()
      } else {
        message('Build link is incorrect: ' + res.build_code, 'error')
      }
    } else {
      message('pob.party link is not defined', 'error')
    }
  })
}

function injectCode () {
  if (script != null) return
  script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', chrome.extension.getURL('js/trade-injected.js'))
  document.body.appendChild(script)
}

loadPob()
}
