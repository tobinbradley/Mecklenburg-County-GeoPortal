// Service worker
import './js/registerServiceWorker'

// CSS
import './css/tailwind.css'
import './css/scrollbar.css'
import './css/button.css'
import './css/links.css'
import './css/sparkline.css'
import './css/print.css'
import './css/youtube.css'
import './css/map.css'

// APP
import App from './App.svelte'
import Search from './components/Search.svelte'
import BackToTop from './components/BackToTop.svelte'
import YouTube from './components/YouTube.svelte'
import Toast from './components/Toast.svelte'

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
      '#search'
    )
  }
})
new Toast({
  target: document.querySelector('#toast')
})



// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    app.$destroy();
  });
}
