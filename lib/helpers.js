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
