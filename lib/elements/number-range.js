'use babel'

export function create(match, textEditor) {
  const element = document.createElement('number-range')
  const leftPosition = '-' + (match.text.length * 8.25) + 'px'

  element.textContent = match.text
  element.style.left = leftPosition

  element.addEventListener('click', function() {
    textEditor.setCursorBufferPosition(match.marker.getBufferRange().start)
  })

  return element
}
