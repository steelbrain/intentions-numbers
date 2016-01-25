'use babel'

import {CompositeDisposable} from 'atom'
import Editor from './editor'
import {calculateFontSize} from './helpers'

export default class NumberRange {
  constructor() {
    this.subscriptions = new CompositeDisposable()
    this.active = true
  }
  activate() {
    calculateFontSize().then(_ => {
      if (this.active)
      this.subscriptions.add(atom.workspace.observeTextEditors(textEditor => {
        const editor = new Editor(textEditor)
        editor.activate()
        this.subscriptions.add(editor)
        textEditor.onDidDestroy(_ => {
          this.subscriptions.remove(editor)
        })
      }))
    })
  }
  dispose() {
    this.active = false
    this.subscriptions.dispose()
  }
}
