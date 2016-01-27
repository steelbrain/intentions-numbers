'use babel'

import {Disposable} from 'atom'

export function disposableEvent(element, event, callback) {
  element.addEventListener(event, callback)
  return new Disposable(function() {
    element.removeEventListener(event, callback)
  })
}
