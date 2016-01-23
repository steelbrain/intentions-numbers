'use babel'

import {CompositeDisposable} from 'atom'
import {rangeKey} from './helpers'

const NUMBER_REGEXP = /\d+/g

export default class Editor {
  constructor(textEditor) {
    this.subscriptions = new CompositeDisposable()
    this.textEditor = textEditor
    this.tokens = []
  }
  activate() {
    // This callback is invoked immediately on editor creation by Atom
    // so we don't need to call tokenize here
    this.subscriptions.add(this.textEditor.onDidStopChanging(_ => this.tokenize()))
  }
  tokenize() {
    const difference = {added: [], removed: []}
    const oldTokens = this.tokens
    const oldKeys = this.tokens.map(item => item.key)
    const newTokens = []
    const newKeys = []

    this.textEditor.scan(NUMBER_REGEXP, match => {
      const range = match.range
      const key = rangeKey(range)
      newTokens.push({key, range})
      newKeys.push(key)
    })

    for (const item of newTokens) {
      if (oldKeys.indexOf(item.key) == -1) {
        difference.added.push(item)
      }
    }

    for (const item of oldTokens) {
      if (newKeys.indexOf(item.key) === -1) {
        difference.removed.push(item)
      }
    }

    this.tokens = newTokens

    console.log(difference)
    // this.applyDiff(difference)
  }
  dispose() {
    for (let key in this.tokens) {
      this.tokens[key].destroy()
    }
    this.tokensKeys = null
    this.textEditor = null
    this.subscriptions.dispose()
  }
}
