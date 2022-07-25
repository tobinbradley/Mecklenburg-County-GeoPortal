<script>
import { location, activeTabs } from '../store.js'

let url

location.subscribe(value => {
  url = window.location
})
activeTabs.subscribe(value => {
  if ($location.lnglat) url = window.location
})


</script>

<div class="flex flex-col justify-center content-center text-center hidden print:block report-pages" style="min-height: 9.4in;">
  <div class="mb-10"><img src="img/logo.svg" alt="logo" class="h-full w-auto m-auto"></div>
  <h1 class="text-5xl font-bold text-sky-900">GeoPortal</h1>
  <h2 class="text-2xl font-bold text-sky-900 mb-5">Mecklenburg County GIS</h2>
  <h3 class="text-xl font-bold text-orange-800">{$location.address}</h3>
  <p>
    <a href="{url}">{url}</a>
  </p>
</div>
