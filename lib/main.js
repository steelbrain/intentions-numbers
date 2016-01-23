'use babel'

import {CompositeDisposable} from 'atom'
import Editor from './editor'

export default class NumberRange {
  constructor() {
    this.subscriptions = new CompositeDisposable()
  }
  activate() {
    this.subscriptions.add(atom.workspace.observeTextEditors(textEditor => {
      const editor = new Editor(textEditor)
      editor.activate()
      this.subscriptions.add(editor)
      textEditor.onDidDestroy(_ => {
        this.subscriptions.remove(editor)
      })
    }))
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
