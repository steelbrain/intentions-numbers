'use babel'

import {CompositeDisposable} from 'atom'
import {rangeKey} from './helpers'

const NUMBER_REGEXP = /\d+/g

export default class Editor {
  constructor(textEditor) {
    this.subscriptions = new CompositeDisposable()
    this.textEditor = textEditor
    this.tokensKeys = []
    this.tokens = {}
  }
  activate() {
    // This callback is invoked immediately on editor creation by Atom
    // so we don't need to call tokenize here
    this.subscriptions.add(this.textEditor.onDidStopChanging(_ => this.tokenize()))
  }
  tokenize() {
    const difference = {added: [], removed: []}
    const oldTokens = this.tokens
    const oldKeys = this.tokensKeys
    const currentKeys = []
    const currentTokens = {}

    this.textEditor.scan(NUMBER_REGEXP, match => {
      const matchRange = match.range
      const key = rangeKey(matchRange)
      currentKeys.push(key)
      currentTokens[key] = matchRange
    })

    for (const key of currentKeys) {
      if (oldKeys.indexOf(key) === -1) {
        difference.added.push(currentTokens[key])
      }
    }

    for (const key of oldKeys) {
      if (currentKeys.indexOf(key) === -1) {
        difference.removed.push(oldTokens[key])
      }
    }

    this.tokens = currentTokens
    this.tokensKeys = currentKeys

    console.log(difference)
    //this.applyDiff(difference)
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
