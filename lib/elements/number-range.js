'use babel'

import {CompositeDisposable, Emitter} from 'atom'

export default class NumberRange {
  constructor(match, textEditor) {
    this.match = match
    this.textEditor = textEditor

    this.subscriptions = new CompositeDisposable()
    this.emitter = new Emitter()
    this.listenerMove = null
    this.listenerUp = null

    this.subscriptions.add(this.emitter)
    this.element = NumberRange.getElement(match)

    this.element.addEventListener('click', _ => {
      textEditor.setCursorBufferPosition(match.marker.getBufferRange().start)
    })
    this.element.addEventListener('mousedown', _ => this.activate(_))
  }
  activate(e) {
    const initialPosition = e.screenX
    this.listenerMove = e => {
      const offset = e.screenX - initialPosition
      this.updateText(offset)
    }
    this.listenerUp = _ => this.deactivate()
    document.addEventListener('mousemove', this.listenerMove)
    document.addEventListener('mouseup', this.listenerUp)
  }
  abort() {
    this.updateText(this.match.text)
    this.deactivate()
  }
  updateText(newText) {
    this.textEditor.setTextInBufferRange(this.match.marker.getBufferRange(), String(newText))
  }
  deactivate() {
    if (this.listenerMove) {
      document.removeEventListener('mousemove', this.listenerMove)
      this.listenerMove = null
    }
    if (this.listenerUp) {
      document.removeEventListener('mouseup', this.listenerUp)
      this.listenerUp = null
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
