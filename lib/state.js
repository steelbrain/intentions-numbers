'use babel'

import {CompositeDisposable} from 'atom'
import {disposableEvent, debounce, applyDifference, generateMarker} from './helpers'

const SHOW_CLASS = 'number-range-show'
const SHOW_CURSOR = 'number-range-cursor'

export default class RangeState {
  constructor(editor, root, children) {
    this.subscriptions = new CompositeDisposable()
    this.root = root
    this.editor = editor
    this.marker = null
    this.checkpoint = null
    this.timeout = null

    const onMouseDown = e => {
      e.stopImmediatePropagation()
      e.preventDefault()
      this.activate(e)
    }

    let i = 0
    let item
    while (item = children[i++]) {
      this.subscriptions.add(disposableEvent(item, 'mousedown', onMouseDown))
    }

    this.root.classList.add(SHOW_CLASS)
  }
  activate(e) {
    const initialX = e.screenX
    const value = e.target.textContent
    const shouldRound = value.indexOf('.') === -1

    this.marker = generateMarker(this.editor, this.root, e)
    this.checkpoint = this.editor.getBuffer().createCheckpoint()

    this.root.classList.add(SHOW_CURSOR)

    let moveEvent = null
    this.subscriptions.add(disposableEvent(document.body, 'mousemove', _ => {
      moveEvent = _
      if (this.timeout === null) {
        this.timeout = setTimeout(() => {
          this.timeout = null
          // Real function starts
          const difference = (moveEvent.screenX - initialX) / 300
          const newValue = applyDifference(value, difference, shouldRound)
          if (newValue !== value) {
            this.editor.setTextInBufferRange(this.marker.getBufferRange(), newValue)
          }
          // Real function ends
        }, 16)
      }
    }))
  }
  dispose() {
    clearInterval(this.timeout)
    if (this.checkpoint) {
      this.editor.getBuffer().groupChangesSinceCheckpoint(this.checkpoint)
      this.checkpoint = null
    }
    if (this.marker) {
      this.marker.destroy()
      this.marker = null
    }

    this.root.classList.remove(SHOW_CLASS)
    this.root.classList.remove(SHOW_CURSOR)
    this.root = null
    this.editor = null
    this.subscriptions.dispose()
  }
  static create(editor, element) {
    return new RangeState(editor, element, element.querySelectorAll('::shadow .numeric'))
  }
}
