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

app.then((module) => {
  module = module.default
  module.init()
})  