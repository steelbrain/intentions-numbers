'use babel'

import {CompositeDisposable, Emitter, Disposable} from 'atom'
import {debounce, disposableEvent} from '../helpers'

export default class NumberRange {
  constructor(match, textEditor) {
    this.subscriptions = new CompositeDisposable()
    this.subscriptionActive = null
    this.emitter = new Emitter()

    this.subscriptions.add(this.emitter)
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
      textEditor.setTextInBufferRange(match.marker.getBufferRange(), newValue)
    }, 60)
    this.deactivate = function() {
      oldValue = parseFloat(newValue)
      if (this.subscriptionActive) {
        this.subscriptionActive.dispose()
      }
    }
  }
  activate(e) {
    const initialPosition = e.screenX

    this.subscriptionActive = new CompositeDisposable()
    this.subscriptionActive.add(disposableEvent(document, 'mousemove', event => {
      this.applyDifference((event.screenX - initialPosition) / 200)
    }))
    this.subscriptionActive.add(disposableEvent(document, 'mouseup', _ => {
      this.deactivate()
    }))
    this.subscriptionActive.add(new Disposable(function() {
      document.body.classList.remove('number-range-active')
      this.subscriptionActive = null
    }))

    document.body.classList.add('number-range-active')
  }
  dispose() {
    this.deactivate()
    this.subscriptions.dispose()
  }

  static getElement(match) {
    const element = document.createElement('number-range')
    const leftPosition = '-' + (match.text.length * 8.25) + 'px'

    element.textContent = match.text
    element.style.left = leftPosition

    return element
  }
}
