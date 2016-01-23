'use babel'

import NumberRange from './main'

module.exports = {
  activate() {
    this.range = new NumberRange()
    this.range.activate()
  },
  deactivate() {
    this.range.dispose()
  }
}
