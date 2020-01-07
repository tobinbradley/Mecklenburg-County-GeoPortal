<script>
  import { location } from './store.js'
  import fetchNearest from './js/fetchNearestMAT.js'

  let showApp = false

  $: if (showApp === true) {
    import(/* webpackChunkName: "app" */ './App.svelte').then(({ default: App }) => {
      new App({
        target: document.querySelector('#app')
      })
    })
  }

  location.subscribe(value => {
    if (value.lnglat && !showApp) {
      showApp = true
      document.querySelector("#print").classList.remove("hidden")
    }
  })

  // detect lnglat URL arg
  const regexLnglat = /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?),\s*[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/gm;
  const hashCoords = window.location.hash.replace('#', '').split('/')[0]
  if (regexLnglat.test(hashCoords)) {
    fetchNearest(hashCoords.split(',')).then(json => {
      location.set({
        label: json[0].address,
        address: json[0].address,
        lnglat: [Number(json[0].lng), Number(json[0].lat)],
        pid: json[0].pid,
        groundpid: json[0].groundpid
      })
    })
  }

</script>