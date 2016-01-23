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

    this.update = debounce(function(newText) {
      textEditor.setTextInBufferRange(match.marker.getBufferRange(), String(newText))
    }, 60)
  }
  activate(e) {
    const initialPosition = e.screenX

    this.subscriptionActive = new CompositeDisposable()
    this.subscriptionActive.add(disposableEvent(document, 'mousemove', event => {
      const difference = event.screenX - initialPosition
      this.update(difference)
    }))
    this.subscriptionActive.add(disposableEvent(document, 'mouseup', _ => {
      this.deactivate()
    }))
    this.subscriptionActive.add(new Disposable(function() {
      document.body.classList.remove('number-range-active')
    }))

    document.body.classList.add('number-range-active')
  }
  deactivate() {
    if (this.subscriptionActive) {
      this.subscriptionActive.dispose()
      this.subscriptionActive = null
    }
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
