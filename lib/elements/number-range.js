'use babel'

import {CompositeDisposable, Emitter, Disposable} from 'atom'
import {debounce, disposableEvent, handlePositionClass, clearPositionClass} from '../helpers'

export default class NumberRange {
  constructor(match, textEditor) {
    this.subscriptions = null
    this.active = false
    this.element = NumberRange.getElement(match.text.length)

    this.element.addEventListener('click', _ => {
      textEditor.setCursorBufferPosition(match.marker.getBufferRange().start)
    })
    this.element.addEventListener('mousedown', _ => {
      this.activate(_)
    })

    let oldValue = parseFloat(match.text)
    let shouldRound = String(match.text).indexOf('.') === -1
    let newValue = String(oldValue)
    let shouldPopHistoryStack = false
    this.applyDifference = debounce(function(difference) {
      const numericNewValue = oldValue + (difference * oldValue)
      if (shouldRound) {
        newValue = String(Math.round(numericNewValue))
      } else {
        newValue = (numericNewValue).toFixed(2)
        if (newValue.slice(-2) === '00') {
          newValue = newValue.slice(0, -3)
        } else if (newValue.slice(-1) === '0') {
          newValue = newValue.slice(0, -1)
        }
      }
      handlePositionClass(difference, textEditor)
      if (shouldPopHistoryStack) {
        textEditor.undo()
      } else shouldPopHistoryStack = true
      textEditor.setTextInBufferRange(match.marker.getBufferRange(), newValue)
    }, 60)
    this.deactivate = function() {
      oldValue = parseFloat(newValue)
      shouldRound = String(newValue).indexOf('.') === -1
      if (this.subscriptions) {
        clearPositionClass(textEditor)
        this.subscriptions.dispose()
      }
      this.active = false
    }
  }
  activate(e) {
    const initialPosition = e.screenX

    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(disposableEvent(document, 'mousemove', event => {
      this.applyDifference((event.screenX - initialPosition) / 200)
    }))
    this.subscriptions.add(disposableEvent(document, 'mouseup', _ => {
      this.deactivate()
    }))
    this.subscriptions.add(new Disposable(function() {
      this.subscriptions = null
    }))
    this.active = true
  }
  dispose() {
    this.deactivate()
  }

  static getElement(length) {
    const element = document.createElement('number-range')
    const leftPosition = '-' + (length * 8.4297) + 'px'

    element.textContent = '_'.repeat(length)
    element.style.left = leftPosition
    element.style.width = (length * 8.4297) + 'px'

    return element
  }
}
