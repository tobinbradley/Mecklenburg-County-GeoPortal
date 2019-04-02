// __________________________________
// / GeoPortal v3, by Tobin Bradley and \
// \ Mecklenburg County GIS.            /
// ----------------------------------
//        \   ^__^
//         \  (oo)\_______
//            (__)\       )\/\
//                ||----w |
//                ||     ||
//

import './main.css'
const app = import('./app.js')

// polyfill if necessary for IE11
if (!(window.fetch && window.Promise)) {
  var js = document.createElement('script')
  js.src = 'https://polyfill.io/v3/polyfill.min.js?features=fetch%2CPromise'
  js.crossorigin = 'anonymous'
  document.head.appendChild(js)
}

app.then(module => {
  module = module.default
  module.init()
})
