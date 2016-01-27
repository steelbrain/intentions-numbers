'use babel'

import {Disposable} from 'atom'

export function disposableEvent(element, event, callback) {
  element.addEventListener(event, callback)
  return new Disposable(function() {
    element.removeEventListener(event, callback)
  })
}

export function debounce(callback, delay) {
  let timeout = null
  let arg = null
  return function(_) {
    arg = _
    if (timeout === null) {
      timeout = setTimeout(() => {
        timeout = null
        callback.call(this, arg)
      }, delay)
    }
  }
}
