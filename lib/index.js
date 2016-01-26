'use babel'

import NumberRange from './main'

module.exports = {
  config: {
    activateOnlyOnAlt: {
      type: 'boolean',
      default: false
    }
  },
  activate() {
    this.range = new NumberRange()
    this.range.activate()
  },
  deactivate() {
    this.range.dispose()
  }
}
