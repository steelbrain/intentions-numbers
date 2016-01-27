'use babel'

import {CompositeDisposable} from 'atom'
import {disposableEvent} from './helpers'
import RangeState from './state'

export default class Editor {
  constructor(textEditor) {
    this.subscriptions = new CompositeDisposable()
    this.textEditor = textEditor
  }
  activate() {
    const textEditorElement = atom.views.getView(this.textEditor)
    let state = null

    this.subscriptions.add(disposableEvent(textEditorElement, 'keydown', function(e) {
      if (process.platform === 'darwin' ? e.which === 18 : e.which === 17) {
        state = RangeState.create(textEditorElement)
      }
    }))
    this.subscriptions.add(disposableEvent(textEditorElement, 'keyup', function() {
      if (state !== null) {
        state.dispose()
        state = null
      }
    }))
  }
  dispose() {
    this.textEditor = null
    this.subscriptions.dispose()
  }
}
