'use babel'

import {Disposable} from 'atom'

export function disposableEvent(element, event, callback) {
  element.addEventListener(event, callback)
  return new Disposable(function() {
    element.removeEventListener(event, callback)
  })
}

export function applyDifference(value, difference, shouldRound) {
  value = value === '0' ? '1' : value
  let newValue = + value + (difference * value)
  if (shouldRound) {
    newValue = String(Math.round(newValue))
  } else {
    newValue = newValue.toFixed(2)
    if (newValue.slice(-2) === '00') {
      newValue = newValue.slice(0, -3)
    } else if (newValue.slice(-1) === '0') {
      newValue = newValue.slice(0, -1)
    }
  }
  return newValue
}
