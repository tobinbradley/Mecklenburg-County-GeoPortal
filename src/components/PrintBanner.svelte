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

<div class="hidden flex flex-col justify-center content-center text-center print:block report-pages" style="min-height: 9in;">
  <div><img src="img/logo.svg" alt="logo" loading="lazy" class="h-full w-auto m-auto"></div>
  <h1 class="text-5xl font-bold text-blue-900">GeoPortal</h1>
  <h2 class="text-2xl font-bold text-blue-900">Mecklenburg County GIS</h2>
  <h3 class="text-xl font-bold">Report for: <span class="text-orange-800">{$location.address}</span></h3>
  <p>
    <a href="{url}">{url}</a>
  </p>
</div>