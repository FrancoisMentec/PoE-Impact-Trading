let pob = document.getElementById('pob-iframe')

let observer = new MutationObserver((mutationsList, observer) => {
  for (let mutation of mutationsList) {
    for (let node of mutation.addedNodes) {
      if (node.className == 'row') {
        let text = node.getElementsByClassName('copy')[0]._v_clipboard.text()
        pob.contentWindow.postMessage({
          message: 'get_item_impact',
          text: text
        }, 'https://pob.party/')
      }
    }
  }
})

observer.observe(document.body, {
  attributes: false,
  childList: true,
  subtree: true
})
