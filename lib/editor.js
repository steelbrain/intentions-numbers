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
    const element = atom.views.getView(this.textEditor)

    this.subscriptions.add(disposableEvent(element, 'keydown', e => {
      if (process.platform === 'darwin' ? e.which === 18 : e.which === 17) {
        this.state = RangeState.create(this.textEditor, element)
      }
    }))
    this.subscriptions.add(disposableEvent(element, 'keyup', () => {
      if (this.state !== null) {
        this.state.dispose()
        this.state = null
      }
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
