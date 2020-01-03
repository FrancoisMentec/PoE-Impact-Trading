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
        //document.getElementsByClassName('resultset')[0].insertBefore(itemImpact, node.nextSibling)

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

window.addEventListener('message', e => {
  if (e.data.message == 'set_item_impact') {
    let item = itemByDataId[e.data.dataId][0]
    let itemImpact = itemByDataId[e.data.dataId][1]
    itemImpact.innerHTML = ''
    let impact = null
    for (let text of e.data.itemImpact) {
      if (/Equipping this item/.test(text)) {
        if (impact != null) itemImpact.appendChild(impact)
        impact = document.createElement('div')
        impact.className = 'impact'
      }
      let p = document.createElement('p')
      while (text.length > 0) {
        let res = /((\^([A-F0-9]|x[A-F0-9]{6}))?[^\^]+)/g.exec(text)
        text = text.replace(res[1], '')
        let s = document.createElement('span')
        if (res[2]) {
          s.style.color = '#' + res[2].replace('^', '').replace('x', '')
        }
        s.innerHTML = res[2]
          ? res[1].replace(res[2], '')
          : res[1]
        p.appendChild(s)

      }
      impact.appendChild(p)
    }
    if (impact != null) itemImpact.appendChild(impact)
    if (itemImpact.children.length > 1) {
      //itemImpact.classList.add('multiple_impact')
    } else {
      item.removeChild(itemImpact)
      item.getElementsByClassName('right')[0].appendChild(itemImpact)
      /*let resultset = document.getElementsByClassName('resultset')[0]
      itemImpact.classList.add('multiple_impact')
      item.getElementsByClassName('right')[0].removeChild(itemImpact)
      let div = document.createElement('div')
      div.className = 'row item_impact_container'
      resultset.insertBefore(div, item)
      resultset.removeChild(item)
      div.appendChild(item)
      div.appendChild(itemImpact)*/

      //document.getElementsByClassName('resultset')[0].insertBefore(itemImpact, item.nextSibling)
    }
    //div.innerHTML = e.data.itemImpact.join('<br>')
    //item.getElementsByClassName('right')[0].appendChild(div)
    //item.appendChild(div)
    //document.getElementsByClassName('resultset')[0].insertBefore(div, item.nextSibling)
  }
}, false)

observer.observe(document.body, {
  attributes: false,
  childList: true,
  subtree: true
})
