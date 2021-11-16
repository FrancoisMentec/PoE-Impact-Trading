let itemByDataId = {}
let enabled = document.currentScript.getAttribute('enabled') == 'true'
let filter = document.currentScript.getAttribute('filter')
filter = filter && filter.length > 0
  ? new RegExp(filter, 'gi')
  : null

// We clear the stack if the search change
document.addEventListener('click', evt => {
  let pob = document.getElementById('pob-iframe')
  if (pob && evt.path.some(e => ['livesearch-btn', 'search-btn', 'clear-btn'].some(c => e.classList && e.classList.contains(c)))) {
    pob.contentWindow.postMessage({ message: 'clear' }, 'https://pob.party/')
  }
})
/*for (let c of ['livesearch-btn', 'search-btn', 'clear-btn']) {
  document.getElementsByClassName(c)[0].addEventListener('click', () => {
    let pob = document.getElementById('pob-iframe')
    if (pob) pob.contentWindow.postMessage({ message: 'clear' }, 'https://pob.party/')
  })
}*/

/**
 * Observe change made to the DOM
 * Especially when items and mods are added
 */
let observer = new MutationObserver((mutationsList, observer) => {
  for (let mutation of mutationsList) {
    for (let node of mutation.addedNodes) {
      if (node.className == 'row') { // An item has been added to the DOM
        let pob = document.getElementById('pob-iframe') // Try to get pob
        if (enabled && typeof pob != 'undefined' && pob != null) { // PoB is enabled, we can fetch the item impact
          let text = node.getElementsByClassName('copy')[0]._v_clipboard.text()
          let dataId = node.getAttribute('data-id')
          // Create div to contain item impact
          let itemImpact = document.createElement('div')
          itemImpact.className = 'item_impact'
          itemImpact.innerHTML = 'Loading impact of the item...'
          node.appendChild(itemImpact)

          itemByDataId[dataId] = [node, itemImpact]
          pob.contentWindow.postMessage({
            message: 'get_item_impact',
            text: text.replace(/\(implicit\)/g, ''),
            dataId: dataId
          }, 'https://pob.party/')
        }

        // Was supposed to add a filter to the mod, but the functionnality already exist by default (magnifying glass button)
        for (let mod of node.querySelectorAll('.implicitMod,.explicitMod')) {
          mod.addEventListener('click', () => {
            console.log(mod.getElementsByClassName('s')[0].innerText.replace(/(?:\+|-)?\d+(?:\.\d+)?(%)?/, '#$1'))
          })
        }
      }
    }
  }
})

let colorName = {
  '^x33FF77': 'upgrade',
  '^xDD0022': 'downgrade'
}

let icons = [
  {
    regex: /Minion:/,
    icon: 'https://gamepedia.cursecdn.com/pathofexile_gamepedia/8/8f/Deathattunement_passive_skill_icon.png?version=8e563d05e9e4b5860b46e6919b50431c'
  },
  {
    regex: /Player/,
    icon: 'https://gamepedia.cursecdn.com/pathofexile_gamepedia/0/07/ArmourGuardsNotable_passive_skill_icon.png?version=ba75ef87dfa9550f2575924e07924a4b'
  }
]

function getIcon(text) {
  for (let icon of icons) {
    if (icon.regex.test(text)) return icon.icon
  }
  return null
}

window.addEventListener('message', e => {
  if (e.data.message == 'set_item_impact') {
    let item = itemByDataId[e.data.dataId][0]
    let itemImpact = itemByDataId[e.data.dataId][1]
    itemImpact.innerHTML = ''
    let impact = null
    let impactTarget = null
    for (let text of e.data.itemImpact) {
      //console.log(text)
      if (impact == null || /Equipping this item|Activating this flask/.test(text)) {
        if (impact != null && (!filter || filter.length <= 0 || filter.test(impact.children[0].innerText + impact.children[1].innerText))) {
          // If there is an impact and it match the filter or there's no filter, we add it
          itemImpact.appendChild(impact)
        }
        impact = document.createElement('div')
        impact.className = 'impact'
      }
      // create line
      let p = document.createElement('p')
      // determine if it's player or minion impact to hide if disabled
      if (/Equipping/.test(text)) impactTarget = null // reset when changing equipement slot
      else if (/Player:/.test(text)) impactTarget = 'player_impact'
      else if (/Minion:/.test(text)) impactTarget = 'minion_impact'
      if (impactTarget) p.classList.add(impactTarget)

      if (/Total DPS/.test(text)) p.classList.add('highlight')
      // Set the line icon
      let icon = getIcon(text)
      if (icon) {
        let iconDiv = document.createElement('img')
        iconDiv.setAttribute('src', icon)
        p.appendChild(iconDiv)
      }
      // goes through the line to set the correct colours
      while (text.length > 0) {
        let res = /((\^([A-F0-9]|x[A-F0-9]{6}))?[^\^]+)/g.exec(text)
        text = text.replace(res[1], '')
        let s = document.createElement('span')
        if (res[2]) { // set text color
          if (typeof colorName[res[2]] !== 'undefined') s.classList.add(colorName[res[2]])
          else s.style.color = res[2].replace(/\^x?/, '#')
        }
        s.innerHTML = res[2]
          ? res[1].replace(res[2], '')
          : res[1]
        p.appendChild(s)

      }
      impact.appendChild(p)
    }
    if (impact != null && (!filter || filter.length <= 0 || filter.test(impact.children[0].innerText + impact.children[1].innerText))) {
      // If there is an impact and it match the filter or there's no filter, we add it
      itemImpact.appendChild(impact)
    }
    if (itemImpact.children.length > 1) { // If multiple items add the class
      itemImpact.classList.add('multiple_impact')
    } else { // Else move the node to the right
      item.removeChild(itemImpact)
      item.getElementsByClassName('right')[0].appendChild(itemImpact)
    }
  } else if (e.data.message == 'toggle') { // Toggle if the automatic impact cmpute is enabled or not
    enabled = e.data.enabled
    if (!enabled) {
      let pob = document.getElementById('pob-iframe') // Try to get pob
      if (pob) pob.contentWindow.postMessage({ message: 'clear' }, 'https://pob.party/')
    }
  } else if (e.data.message == 'filter') { // update the filter
    filter = e.data.filter && e.data.filter.length > 0
      ? new RegExp(e.data.filter, 'gi')
      : null
  }
}, false)

observer.observe(document.body, {
  attributes: false,
  childList: true,
  subtree: true
})
