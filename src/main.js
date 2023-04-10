// Service worker
import './js/registerServiceWorker'

// CSS
import './app.css'

// APP
import App from './App.svelte'
import Search from './components/Search.svelte'
import BackToTop from './components/BackToTop.svelte'
import YouTube from './components/YouTube.svelte'

// kick off the Svelte
new Search({
  target: document.querySelector('#search')
})
new YouTube({
  target: document.querySelector('#tutorial')
})
new App({
  target: document.querySelector('#app')
})
new BackToTop({
  target: document.querySelector(
    '#backtotop'
  ),
  props: {
    track: document.querySelector(
      'nav'
    )
  }
})
