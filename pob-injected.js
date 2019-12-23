let y2name = {}
let stats = {}

let i = 0

function override () {
  let cloneDraw = Object.assign({}, draw)

  draw.StartFrame = function () {
    y2name = {}
    cloneDraw.StartFrame()
  }

  draw.p_DrawString = function p_DrawString (x, y, align, size, font, text) {
    let r = /(\^(?:[ABCDEF0123456789]|x[ABCDEF0123456789]{6}))?([^%:]*)/.exec(text)
    let value = r[2]

    if (x == 170 && align == 'RIGHT_X') {
      y2name[y] = value
    } else if (x == 174 && align == 'LEFT') {
      stats[y2name[y]] = parseFloat(value)
    }

    cloneDraw.p_DrawString(x, y, align, size, font, text)
  }

  /*let clone__fillMouseEventData = __fillMouseEventData.bind({})
  __fillMouseEventData = function (eventStruct, e, target) {
    console.log((i++) + " __fillMouseEventData " + eventStruct + " " + e.type)
    console.log(e)
    console.log(target)
    clone__fillMouseEventData(eventStruct, e, target)
  }*/

  let clone__registerKeyEventCallback = __registerKeyEventCallback.bind({})
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
   return Module["asm"]["Ga"].apply(null, arguments);
 }
}

//override()

let coordsOf = {
  'skills': [115, 70],
  'items': [188, 70],
  'create_custom': [1308, 76],
  'import/export': [69, 44],
  'import_code': [379, 179],
  'import': [349, 235],
  'middle': [window.innerWidth/2, window.innerHeight/2]
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
  let coords = coordsOf[name]
  glCanvas.dispatchEvent(createMouseEvent('mousedown', coords[0], coords[1]))
  glCanvas.dispatchEvent(createMouseEvent('mouseup', coords[0], coords[1]))
}

function test () {
  clickOn('items')
  setTimeout(() => {
    clickOn('create_custom')
    setTimeout(() => { clickOn('middle') }, 1)
  }, 1)
  _inject_paste()
  Module["_inject_paste"]()
}
