let importStack = [] // Used to import the build, highest priority stack, can only be cleared by a new import message
let inputStack = [] // Regular stack to compute item impact
let overrided = false
let iframeVisible = false

let itemImpactCoord = null

let propertiesList = []
class Property {
  constructor (defaultValue) {
    this.defaultValue = Array.isArray(defaultValue)
      ? defaultValue.slice()
      : defaultValue
    this._val = Array.isArray(this.defaultValue)
      ? this.defaultValue.slice()
      : this.defaultValue
    this._new = Array.isArray(this.defaultValue)
      ? this.defaultValue.slice()
      : this.defaultValue

    propertiesList.push(this)
  }

  set val (val) {
    this._new = val
    this._val = val
  }

  get val () {
    return this._val
  }

  push (val) {
    this._new.push(val)
  }

  update () {
    this._val = Array.isArray(this._new)
      ? this._new.slice()
      : this._new
    this._new = Array.isArray(this.defaultValue)
      ? this.defaultValue.slice()
      : this.defaultValue
  }
}

let itemImpact = new Property([])
let createItemVisible = new Property(false)

window.addEventListener('message', e => {
  if (e.data.message == 'get_item_impact') {
    clickOn('items')
    clickOn('create_custom')
    paste(e.data.text)
    moveTo('Create')
    skip()
    setItemImpact(e.data.dataId)
    clickOn('Cancel')
  } else if (e.data.message == 'clear') {
    inputStack = [] // Clear the stack
    clickOn('Cancel') // To close the item creation popup if opened
  } else if (e.data.message == 'set_visible') {
    iframeVisible = e.data.value
  } else if (e.data.message == 'set_build') {
    console.log('received message')
    importStack = [
      ['mousedown', 'import/export'],
      ['mouseup', 'import/export'],
      ['mousedown', 'import_code'],
      ['mouseup', 'import_code'],
      ['paste', e.data.build_code],
      ['mousedown', 'import'],
      ['mouseup', 'import']
    ]
  }/* else { // Some messages sent by pob.party itself would trigger this
    console.error('Unknown message: ' + e.data.message)
    console.error(e)
  }*/

  if (typeof Browser != 'undefined') {
    try {
      Browser.mainLoop.resume()
    } catch (err) {
      // Sometimes the runner isn't defined yet, no need to print the error
    }
  }
}, false)

function override () {
  if (typeof draw == 'undefined') return // We're on a shareable link

  let cloneDraw = Object.assign({}, draw)

  draw.StartFrame = function () {
    cloneDraw.StartFrame.call(draw)
  }

  draw.EndFrame = function () {
    for (let p of propertiesList) {
      p.update()
    }
    if (importStack.length > 0) {
      triggerInput(importStack.shift())
    } else if (inputStack.length > 0) {
      triggerInput(inputStack.shift())
    } else if (window.self !== window.top && !iframeVisible) {
      Browser.mainLoop.pause() // pause to save GPU
    }
    cloneDraw.EndFrame.call(draw)
  }

  draw.p_DrawString = function p_DrawString (x, y, align, size, font, text) {
    if (['Create', 'Cancel'].includes(text)) {
      coordsOf[text] = [x, y]
    } else if (/Equipping this item|Activating this flask/.test(text)/*text.startsWith('^7Equipping this item')*/) {
      itemImpactCoord = {x: x, y: y}
      itemImpact.push(text)
    } else if (itemImpactCoord != null && x == itemImpactCoord.x && y > itemImpactCoord.y) {
      itemImpact.push(text)
    } else if (text == 'Create Custom Item from Text') {
      createItemVisible.val = true
    }
    //console.log(text)
    //console.log(`${text} (${x}, ${y})`)
    cloneDraw.p_DrawString.call(draw, x, y, align, size, font, text)
  }

  /*let clone__fillMouseEventData = __fillMouseEventData.bind({})
  __fillMouseEventData = function (eventStruct, e, target) {
    console.log((i++) + " __fillMouseEventData " + eventStruct + " " + e.type)
    console.log(e)
    console.log(target)
    clone__fillMouseEventData(eventStruct, e, target)
  }

  let clone__registerKeyEventCallback = __registerKeyEventCallback.bind({})
  __registerKeyEventCallback = function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    console.log((i++) + " __registerKeyEventCallback -----------------------------------------------")
    console.log(target)
    console.log(userData);
    console.log(eventTypeId);
    console.log(eventTypeString);
    clone__registerKeyEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread)
  }

  _inject_paste = Module["_inject_paste"] = function () {
    console.log('_inject_paste')
    console.log(arguments)
   return Module["asm"]["Ga"].apply(null, arguments);
 }*/
}

override()

/*
Coordinates of a few elements
PoB dimension are set, it's not responsive, this is why those values are hard set
*/
let coordsOf = {
  'skills': [115, 70],
  'items': [188, 70],
  'create_custom': [1308, 76],
  'import/export': [69, 44],
  'import_code': [379, 179],
  'import': [349, 235],
  'middle': [() => window.innerWidth/2, () => window.innerHeight/2]
}

function triggerInput (input) {
  if (input[0] == 'skip') {
    return
  } else if (input[0].startsWith('mouse')) { // Mouse Events
    try {
      let coords = coordsOf[input[1]]
      if (typeof coords[0] == 'function') coords[0] = coords[0]()
      if (typeof coords[1] == 'function') coords[1] = coords[1]()
      glCanvas.dispatchEvent(createMouseEvent(input[0], coords[0], coords[1]))
    } catch (error) {
      console.error(error)
      message(`Failed to get the coordinates of "${input[1]}". Try to maximise your window then refresh the page.`, 'error')
    }
  } else if (input[0] == 'paste') { // Paste
    try {
      Module["asm"]["Ga"].apply(null, [allocate(intArrayFromString(input[1]), "i8", ALLOC_NORMAL)]) // Doesn't work for the import field
      //doesnt seem to work for any browser anymore, fallback to the old method until a workaround can be found
    } catch (error) {
      let dt = new DataTransfer()
      dt.setData('text/plain', input[1])
      let e = new ClipboardEvent('paste', {
        clipboardData: dt,
        dataType: 'text/plain',
        data: input[1],
        bubbles: true,
        cancelable: true,
        composed: true
      })
      window.body.dispatchEvent(e)
    }
  } else if (input[0] == 'set_item_impact') {
    window.top.postMessage({
      message: 'set_item_impact',
      itemImpact: itemImpact.val,
      dataId: input[1]
    }, '*')
  } else {
    throw new Error('Unknown event type: ' + input[0])
  }
}

function createMouseEvent (type, x, y) {
  return new MouseEvent(type, {
    button: 0,
    target: glCanvas,
    clientX: x,
    clientY: y
  })
}

function clickOn (name) {
  inputStack.push(['mousedown', name])
  inputStack.push(['mouseup', name])
}

function moveTo (name) {
  inputStack.push(['mousemove', name])
}

function paste (value) {
  inputStack.push(['paste', value])
}

function skip () {
  inputStack.push(['skip'])
}

function setItemImpact (id) {
  inputStack.push(['set_item_impact', id])
}

function message (content, type='message', timeout=null, append=false) {
  window.top.postMessage({
    message: 'message',
    content: content,
    type: type,
    timeout: timeout,
    append: append
  }, '*')
}
