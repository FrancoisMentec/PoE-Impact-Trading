let itemByDataId = {}

let observer = new MutationObserver((mutationsList, observer) => {
  let pob = document.getElementById('pob-iframe')
  if (typeof pob == 'undefined' || pob == null) return // pob is disabled

  for (let mutation of mutationsList) {
    for (let node of mutation.addedNodes) {
      if (node.className == 'row') {
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
        if (impact != null) itemImpact.appendChild(impact)
        impact = document.createElement('div')
        impact.className = 'impact'
      }
      // create line
      let p = document.createElement('p')
      // determine if it's player or minion impact to hide if disabled
      if (/Player:/.test(text)) impactTarget = 'player_impact'
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
    if (impact != null) itemImpact.appendChild(impact)
    if (itemImpact.children.length > 1) { // If multiple items add the class
      itemImpact.classList.add('multiple_impact')
    } else { // Else move the node to the right
      item.removeChild(itemImpact)
      item.getElementsByClassName('right')[0].appendChild(itemImpact)
    }
  }
}, false)

observer.observe(document.body, {
  attributes: false,
  childList: true,
  subtree: true
})
