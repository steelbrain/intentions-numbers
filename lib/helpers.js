'use babel'

import {Disposable} from 'atom'

const NUMBER_REGEXP = /\-?\d*\.?\d+/g

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

export function applyDifference(value, difference, shouldRound) {
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

export function generateMarker(editor, element, event) {
  const position = element.component.screenPositionForMouseEvent(event)
  const textForLine = editor.getTextInBufferRange([[position.row, 0], [position.row, Infinity]])

  let match
  let range = null
  do {
    match = NUMBER_REGEXP.exec(textForLine)
    if (match) {
      const openingIndex = match.index
      const closingIndex = match.index + match[0].length
      if (openingIndex <= position.column && closingIndex >= position.column) {
        range = [[position.row, openingIndex], [position.row, closingIndex]]
      }
    }
  } while (match)

  if (range === null) {
    console.debug('[number-range] Unable to identify number from', JSON.stringify(textForLine))
    range = [position, position]
  }
  return editor.markBufferRange(range, {
    invalidate: 'never'
  })
}
