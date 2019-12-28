let pob = document.getElementById('pob-iframe')

let itemByDataId = {}

let observer = new MutationObserver((mutationsList, observer) => {
  for (let mutation of mutationsList) {
    for (let node of mutation.addedNodes) {
      if (node.className == 'row') {
        let text = node.getElementsByClassName('copy')[0]._v_clipboard.text()
        let dataId = node.getAttribute('data-id')
        itemByDataId[dataId] = node
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
    let item = itemByDataId[e.data.dataId]
    let div = document.createElement('div')
    div.className = 'item_impact'
    for (let text of e.data.itemImpact) {
      //let res = /(\^(?:([ABCDEF0123456789])|x([ABCDEF0123456789]{6})))?([^\^]*)/g.exec(text)
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
      div.appendChild(p)
    }
    //div.innerHTML = e.data.itemImpact.join('<br>')
    item.getElementsByClassName('right')[0].appendChild(div)
  }
}, false)

observer.observe(document.body, {
  attributes: false,
  childList: true,
  subtree: true
})
