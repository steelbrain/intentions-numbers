'use babel'

import {CompositeDisposable} from 'atom'
import {create as createRangeElement} from './elements/number-range'
import {rangeKey} from './helpers'

const NUMBER_REGEXP = /\d+/g

export default class Editor {
  constructor(textEditor) {
    this.pointer = 0

    this.subscriptions = new CompositeDisposable()
    this.textEditor = textEditor
    this.tokens = []
    this.markers = {}
  }
  activate() {
    // This callback is invoked immediately on editor creation by Atom
    // so we don't need to call tokenize here
    this.subscriptions.add(this.textEditor.onDidStopChanging(_ => this.tokenize()))
  }
  tokenize() {
    const difference = {added: [], removed: []}
    const oldTokens = this.tokens
    const oldKeys = []
    const newTokens = []
    const newKeys = []
    const tokens = []

    this.textEditor.scan(NUMBER_REGEXP, match => {
      const range = match.range
      const key = rangeKey(range)
      newTokens.push({key, range, pointer: null, marker: null, text: match.matchText})
      newKeys.push(key)
    })

    for (const item of oldTokens) {
      item.key = rangeKey(item.marker.getBufferRange())
      if (newKeys.indexOf(item.key) === -1) {
        difference.removed.push(item)
      } else {
        oldKeys.push(item.key)
        tokens.push(item)
      }
    }

    for (const item of newTokens) {
      if (oldKeys.indexOf(item.key) == -1) {
        difference.added.push(item)
        tokens.push(item)
      }
    }

    this.tokens = tokens
    this.applyDiff(difference)
  }
  applyDiff(difference) {
    if (difference.added.length) {
      for (const match of difference.added) {
        const pointer = this.pointer++
        const marker = this.textEditor.markBufferRange(match.range, {invalidate: 'never'})
        match.marker = marker
        match.pointer = pointer

        this.textEditor.decorateMarker(marker, {
          type: 'overlay',
          position: 'head',
          item: createRangeElement(match, this.textEditor)
        })
      }
    }

    if (difference.removed.length) {
      for (const match of difference.removed) {
        match.marker.destroy()
        delete this.markers[match.pointer]
      }
    }
  }
  dispose() {
    this.tokens = null
    this.textEditor = null
    this.subscriptions.dispose()
  }
}
