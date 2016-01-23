'use babel'

export function rangeKey(range) {
  return range.start.row + ':' + range.start.column + '::' + range.end.row + ':' + range.end.column
}
