'use babel'

import {CompositeDisposable} from 'atom'
import {disposableEvent} from './helpers'
import RangeState from './state'

export default class Editor {
  constructor(textEditor) {
    this.subscriptions = new CompositeDisposable()
    this.textEditor = textEditor
    this.state = null
  }
  activate() {
    let shouldEnable = false
    const element = atom.views.getView(this.textEditor)
    const disable = (force) => {
      if (this.state !== null) {
        this.state.dispose()
        this.state = null
      }
      if (force !== true) {
        shouldEnable = false
      }
    }
    const enable = (e, force) => {
      if ((force && shouldEnable) || (process.platform === 'darwin' ? e.which === 18 : e.which === 17)) {
        shouldEnable = true
        this.state = RangeState.create(this.textEditor, element)
      }
    }

    this.subscriptions.add(disposableEvent(element, 'keydown', enable))
    this.subscriptions.add(disposableEvent(element, 'keyup', disable))
    this.subscriptions.add(disposableEvent(element, 'mouseup', function() {
      disable(true)
      enable({}, true)
    }))
  }
  dispose() {
    this.textEditor = null
    this.subscriptions.dispose()
    if (this.state) {
      this.state.dispose()
    }
  }
}
