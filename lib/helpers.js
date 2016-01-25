'use babel'

import {Disposable} from 'atom'

export function rangeKey(range) {
  return range.start.row + ':' + range.start.column + '::' + range.end.row + ':' + range.end.column
}

export function debounce(callback, delay) {
  let timeout = null
  return function(arg) {
    if (timeout === null) {
      timeout = setTimeout(() => {
        timeout = null
        callback.call(this, arg)
      }, delay)
    }
  }
}

export function disposableEvent(element, event, callback) {
  element.addEventListener(event, callback)
  return new Disposable(function() {
    element.removeEventListener(event, callback)
  })
}

const EDITOR_CLASS = {
  LEFT: 'number-range-left',
  RIGHT: 'number-range-right',
  MIDDLE: 'number-range-middle'
}

export function handlePositionClass(difference, textEditor) {
  const activeClass = difference === 0 ? EDITOR_CLASS.MIDDLE : difference < 0 ? EDITOR_CLASS.LEFT : EDITOR_CLASS.RIGHT
  const editorElement = atom.views.getView(textEditor)

  if (activeClass === EDITOR_CLASS.LEFT) {
    editorElement.classList.add(EDITOR_CLASS.LEFT)
  } else {
    editorElement.classList.remove(EDITOR_CLASS.LEFT)
  }

  if (activeClass === EDITOR_CLASS.RIGHT) {
    editorElement.classList.add(EDITOR_CLASS.RIGHT)
  } else {
    editorElement.classList.remove(EDITOR_CLASS.RIGHT)
  }

  if (activeClass === EDITOR_CLASS.MIDDLE) {
    editorElement.classList.add(EDITOR_CLASS.MIDDLE)
  } else {
    editorElement.classList.remove(EDITOR_CLASS.MIDDLE)
  }
}

export function clearPositionClass(textEditor) {
  const editorElement = atom.views.getView(textEditor)
  editorElement.classList.remove(EDITOR_CLASS.LEFT)
  editorElement.classList.remove(EDITOR_CLASS.RIGHT)
  editorElement.classList.remove(EDITOR_CLASS.MIDDLE)
}

let fontSize = null

export function getFontSize() {
  return fontSize
}
export function calculateFontSize() {
  const element = document.createElement('div')
  element.textContent = 'H'
  element.style.display = 'none'
  document.body.appendChild(element)
  return new Promise(function(resolve) {
    requestAnimationFrame(function() {
      fontSize = (parseInt(String(getComputedStyle(element).fontSize).slice(0, -2)) || 11) * 0.766336364
      element.remove()
      resolve(fontSize)
    })
  })
}
