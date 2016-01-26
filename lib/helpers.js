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

const EDITOR_CLASS = 'number-range-cursor'

export function handlePositionClass(textEditor, add) {
  const view = atom.views.getView(textEditor)
  if (add) {
    view.classList.add(EDITOR_CLASS)
  } else {
    view.classList.remove(EDITOR_CLASS)
  }
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
