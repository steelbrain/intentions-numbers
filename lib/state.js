'use babel'

import {CompositeDisposable} from 'atom'
import {disposableEvent} from './helpers'

const SHOW_CLASS = 'number-range-show'
const SHOW_CURSOR = 'number-range-cursor'

export default class RangeState {
  constructor(root, children) {
    this.subscriptions = new CompositeDisposable()
    this.root = root

    const onMouseDown = e => {
      e.stopImmediatePropagation()
      e.preventDefault()
      this.activate()
    }

    let i = 0
    let item
    while (item = children[i++]) {
      this.subscriptions.add(disposableEvent(item, 'mousedown', onMouseDown))
    }

    this.root.classList.add(SHOW_CLASS)
  }
  activate() {
    this.root.classList.add(SHOW_CURSOR)
  }
  dispose() {
    this.root.classList.remove(SHOW_CLASS)
    this.root.classList.remove(SHOW_CURSOR)
    this.root = null
    this.subscriptions.dispose()
  }
  static create(element) {
    return new RangeState(element, element.querySelectorAll('::shadow .numeric'))
  }
}
