'use babel'

import NumberRange from './main'

module.exports = {
  config: {
    requireKeyPress: {
      description: 'Require a key to be pressed to drag numbers',
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
