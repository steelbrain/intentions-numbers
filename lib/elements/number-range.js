'use babel'

import {CompositeDisposable, Emitter, Disposable} from 'atom'
import {debounce, disposableEvent} from '../helpers'

export default class NumberRange {
  constructor(match, textEditor) {
    this.subscriptions = null
    this.active = false
    this.element = NumberRange.getElement(match)

    this.element.addEventListener('click', _ => {
      textEditor.setCursorBufferPosition(match.marker.getBufferRange().start)
    })
    this.element.addEventListener('mousedown', _ => {
      this.activate(_)
    })

    let oldValue = parseFloat(match.text)
    let newValue = null
    this.applyDifference = debounce(function(difference) {
      newValue = (oldValue + (difference * oldValue)).toFixed(2)
      if (newValue.slice(-2) === '00') {
        newValue = newValue.slice(0, -3)
      } else if (newValue.slice(-1) === '0') {
        newValue = newValue.slice(0, -1)
      }
      textEditor.setTextInBufferRange(match.marker.getBufferRange(), newValue)
    }, 60)
    this.deactivate = function() {
      oldValue = parseFloat(newValue)
      if (this.subscriptions) {
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

  static getElement(match) {
    const element = document.createElement('number-range')
    const leftPosition = '-' + (match.text.length * 8.25) + 'px'

    element.textContent = match.text
    element.style.left = leftPosition

    return element
  }
}
