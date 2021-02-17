<script>
  import fetchNearest from './js/fetchNearestMAT.js'
  import { activeTabs, tabs, location } from './store.js'
  import Schools from './components/Schools.svelte'
  import Trash from './components/Trash.svelte'
  import Parks from './components/Parks.svelte'
  import Libraries from './components/Libraries.svelte'
  import Property from './components/Property.svelte'
  import Environment from './components/Environment.svelte'
  import Impervious from './components/Impervious.svelte'
  import Community from './components/Community.svelte'
  import Voting from './components/Voting.svelte'
  import Jump from './components/Jump.svelte'
  import PrintBanner from './components/PrintBanner.svelte'

  const comps = {
    parks: Parks,
    schools: Schools,
    trash: Trash,
    libraries: Libraries,
    property: Property,
    environment: Environment,
    impervious: Impervious,
    community: Community,
    voting: Voting
  }


  location.subscribe(value => {
    if (value.lnglat) {
      document.querySelector("#print").classList.remove("hidden")
      history.replaceState(null, null, `#${value.lnglat}/${$activeTabs.join(',')}`)
    }
  })
  // Set history hash
  activeTabs.subscribe(value => {
    if ($location.lnglat) {
      history.replaceState(null, null, `#${$location.lnglat}/${$activeTabs.join(',')}`)
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

{#if $location.label}

<Jump />

<PrintBanner />

{#each $tabs as tab}
  {#if $activeTabs.indexOf(tab.id) !== -1}
  <div class="report-pages">
    <svelte:component this={comps[tab.id]}/>
  </div>
  {/if}
{/each}

{/if}
