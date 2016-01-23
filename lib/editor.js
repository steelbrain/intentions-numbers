'use babel'

import {CompositeDisposable} from 'atom'

export default class Editor {
  constructor(textEditor) {
    this.subscriptions = new CompositeDisposable()
  }
  activate() {

  }
  dispose() {
    this.subscriptions.dispose()
  }
}
