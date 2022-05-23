import { addEventListener } from '../magic'

export function openDevTools() {
  return addEventListener(document, 'keydown', e => {
    if (e.ctrlKey && e.altKey && e.keyCode === 49 && e.code) {
      ipcRenderer.send('openDevTools')
    }
  })
}

