import 'promise-polyfill/src/polyfill'
import './js/registerServiceWorker'
import AppLoader from './AppLoader.svelte'
import Search from './components/Search.svelte'
import BackToTop from './components/BackToTop.svelte'
import YouTube from './components/YouTube.svelte'
import Toast from './components/Toast.svelte'
import './utils.css'


// Optional polyfills - thank you IE
const polyfills = []
if (!window.fetch) {
  polyfills.push(import(/* webpackChunkName: "polyfill-fetch" */ 'whatwg-fetch'))
  polyfills.push(import(/* webpackChunkName: "polyfill-core-js" */ 'core-js'))
}
if (!window.IntersectionObserver) {
  polyfills.push(import(/* webpackChunkName: "polyfill-io" */ './js/polyfill-io'))
}

// Execute after any polyfills
Promise.all(polyfills).then(() => {
  new Search({
    target: document.querySelector('#search')
  })

  new YouTube({
    target: document.querySelector('#tutorial')
  })

  new AppLoader({
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

})
