'use babel'

import {CompositeDisposable} from 'atom'
import NumberRange from './elements/number-range'
import {rangeKey, disposableEvent, debounce} from './helpers'
import {Range} from 'atom'

const NUMBER_REGEXP = / \-?\d*\.?\d+/g

export default class Editor {
  constructor(textEditor) {
    this.pointer = 0

    this.subscriptions = new CompositeDisposable()
    this.textEditor = textEditor
    this.tokens = []
    this.markers = {}
    this._tokenize = debounce(this.tokenize, 16)
  }
  activate() {
    const textEditorClass = 'number-range-show'
    const textEditorElement = atom.views.getView(this.textEditor)
    let requireKeyPress = null

    // This callback is invoked immediately on editor creation by Atom
    // so we don't need to call tokenize here
    this.subscriptions.add(this.textEditor.onDidStopChanging(_ => this._tokenize()))
    this.subscriptions.add(atom.config.observe('number-range.requireKeyPress', value => {
      requireKeyPress = value
      if (!requireKeyPress) {
        textEditorElement.classList.add(textEditorClass)
      } else {
        textEditorElement.classList.remove(textEditorClass)
      }
    }))
    this.subscriptions.add(disposableEvent(textEditorElement, 'keydown', function(e) {
      if (requireKeyPress && (process.platform === 'darwin' ? e.which === 18 : e.which === 17) ) {
        textEditorElement.classList.add(textEditorClass)
      }
    }))
    this.subscriptions.add(disposableEvent(textEditorElement, 'keyup', function(e) {
      if (requireKeyPress && (process.platform === 'darwin' ? e.which === 18 : e.which === 17) ) {
        textEditorElement.classList.remove(textEditorClass)
      }
    }))
  }
  tokenize() {
    const difference = {added: [], removed: []}
    const oldTokens = this.tokens
    const oldKeys = []
    const newTokens = []
    const newKeys = []
    const tokens = []
    const tokensMap = {}

    this.textEditor.scan(NUMBER_REGEXP, match => {
      const range = match.range
      range.start.column++
      const key = rangeKey(range)
      const tokenInfo = {key, range, pointer: null, marker: null, text: match.matchText}
      newTokens.push(tokenInfo)
      newKeys.push(key)
      tokensMap[key] = tokenInfo
    })

    for (const item of oldTokens) {
      item.key = rangeKey(item.marker.getBufferRange())
      if (newKeys.indexOf(item.key) === -1 || (!item.range.active && tokensMap[item.key].text !== item.text)) {
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
        match.range = new NumberRange(match, this.textEditor)

        this.textEditor.decorateMarker(marker, {
          type: 'overlay',
          position: 'tail',
          item: match.range.element
        })
      }
    }

    if (difference.removed.length) {
      for (const match of difference.removed) {
        match.marker.destroy()
        match.range.dispose()
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
