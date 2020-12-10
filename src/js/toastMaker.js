import { toastMessage } from '../store.js'

export default function (messageType = "info", message = "We're experiencing technical difficulties. Please try again later.", loadDelay = 0, dissmissDelay = 5000) {
  toastMessage.set({
    message: message,
    messageType: messageType,
    loadDelay: loadDelay,
    dismissDelay: dissmissDelay
  })
}