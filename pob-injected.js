let y2name = {}
let stats = {}

let inputStack = []
let overrided = false
let createCustom = false

let itemImpactCoord = null
let newItemImpact = []
let itemImpact = []

window.addEventListener('message', e => {
  if (e.data.message == 'get_item_impact') {
    if (!createCustom) {
      clickOn('items')
      clickOn('create_custom')
      clickOn('middle')
      createCustom = true
    }
    paste(e.data.text)
    console.log(e.data.text)
  }
}, false)

function override () {
  let cloneDraw = Object.assign({}, draw)

  draw.StartFrame = function () {
    y2name = {}
    newItemImpact = []
    cloneDraw.StartFrame.call(draw)
  }

  draw.EndFrame = function () {
    itemImpact = newItemImpact
    if (inputStack.length > 0) {
      triggerInput(inputStack.shift())
    }
    cloneDraw.EndFrame.call(draw)
  }

  draw.p_DrawString = function p_DrawString (x, y, align, size, font, text) {
    let r = /(\^(?:[ABCDEF0123456789]|x[ABCDEF0123456789]{6}))?(.*)/.exec(text)
    let value = r[2]

    if (x == 170 && align == 'RIGHT_X') {
      y2name[y] = value
    } else if (x == 174 && align == 'LEFT') {
      stats[y2name[y]] = value
    } else if (text == 'Create') {
      coordsOf['create'] = [x, y]
    } else if (text.startsWith('^7Equipping this item')) {
      itemImpactCoord = {x: x, y: y}
      newItemImpact.push(value)
    } else if (itemImpactCoord != null && x == itemImpactCoord.x && y > itemImpactCoord.y) {
      newItemImpact.push(value)
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
  }*/

  /*let clone__registerKeyEventCallback = __registerKeyEventCallback.bind({})
  __registerKeyEventCallback = function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    console.log((i++) + " __registerKeyEventCallback -----------------------------------------------")
    console.log(target)
    console.log(userData);
    console.log(eventTypeId);
    console.log(eventTypeString);
    clone__registerKeyEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread)
  }

  _inject_paste = Module["_inject_paste"] = function() {
    console.log('_inject_paste')
    console.log(arguments)
    var err = new Error()
    console.error(err.stack)
   return Module["asm"]["Ga"].apply(null, arguments);
 }*/
}

override()

let coordsOf = {
  'skills': [115, 70],
  'items': [188, 70],
  'create_custom': [1308, 76],
  'import/export': [69, 44],
  'import_code': [379, 179],
  'import': [349, 235],
  'middle': [() => window.innerWidth/2, () => window.innerHeight/2],
  'create': null
}

function triggerInput (input) {
  if (input[0].startsWith('mouse')) { // Mouse Events
    let coords = coordsOf[input[1]]
    if (typeof coords[0] == 'function') coords[0] = coords[0]()
    if (typeof coords[1] == 'function') coords[1] = coords[1]()
    glCanvas.dispatchEvent(createMouseEvent(input[0], coords[0], coords[1]))
  } else if (input[0] == 'paste') { // Paste
    let dt = new DataTransfer()
    dt.getData = function (t) { return input[1] }
    let e = new ClipboardEvent('paste', {
      clipboardData: dt,
      dataType: 'text/plain',
      data: input[1]
    })
    window.body.dispatchEvent(e)
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

function test () {
  /*clickOn('items')
  setTimeout(() => {
    clickOn('create_custom')
    setTimeout(() => {
      clickOn('middle')
      setTimeout(() => {
        paste('hello world')
      }, 10)
    }, 10)
  }, 10)*/
  clickOn('items')
  clickOn('create_custom')
  clickOn('middle')
  paste(`Rarity: Unique
Death's Opus
Death Bow
--------
Bow
Quality: +20% (augmented)
Physical Damage: 79-200 (augmented)
Critical Strike Chance: 7.40% (augmented)
Attacks per Second: 1.32 (augmented)
--------
Requirements:
Level: 44
Dex: 107
--------
Sockets: R-G-G-G
--------
Item Level: 33
--------
48% increased Critical Strike Chance (implicit)
--------
113% increased Physical Damage
Adds 14 to 33 Physical Damage
10% increased Attack Speed
+100% to Global Critical Strike Multiplier
Bow Attacks fire 2 additional Arrows
--------
The overture stretches thin,
The chorus gathers to begin.
Stacatto, drone, a rest drawn long,
Another hears Death's final song.
--------
Note: ~price 140 chaos
`)
  moveTo('create')
}
