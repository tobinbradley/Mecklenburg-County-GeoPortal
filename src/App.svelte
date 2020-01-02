<script>
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

  // Set history hash
  // #-80.8486,35.1528/welcome
  location.subscribe(value => {
    history.replaceState(null, null, `#${value.lnglat}/${$activeTabs.join(',')}`)
  })
  activeTabs.subscribe(value => {
    if ($location.lnglat) updateHistory()
  })
  function updateHistory() {
    history.replaceState(null, null, `#${$location.lnglat}/${$activeTabs.join(',')}`)
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