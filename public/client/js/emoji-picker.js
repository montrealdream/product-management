// TOOLTIP
import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
const iconEmoji = document.querySelector('.fa-face-smile')
const tooltip = document.querySelector('.tooltip')
Popper.createPopper(iconEmoji, tooltip)

document.querySelector('.fa-face-smile').onclick = () => {
  tooltip.classList.toggle('shown')
}
// END TOOLTIP