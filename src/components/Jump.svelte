<script>
import { activeTabs, tabs, scroll, location } from '../store.js'


function setButtonStyle(tab) {
  if ($activeTabs.filter(elem => elem === tab).length === 0) {
    return 'bg-gray-300 hover:bg-gray-400 text-gray-800'
  }
  return 'shadow-md bg-blue-700 shadow-blue-700/50 hover:bg-blue-800 hover:shadow-blue-800/50 text-white'
}

// update active tabs
const setTab = (tab) => () => {
  $scroll = true
  if ($activeTabs.indexOf(tab) === -1) {
    activeTabs.update(value => {
      value.push(tab)
      return value
    })
  } else {
    activeTabs.update(value => {
      value.splice(value.indexOf(tab), 1)
      return value
    })
  }
}

</script>

<h2 class="print:hidden text-center mt-12 font-bold text-xl md:text-2xl text-orange-600">{$location.address}</h2>
<div class="md:flex mt-2 flex-wrap justify-center items-center text-center md:mx-24 print:hidden">
  {#each $tabs as tab}
  <button class="btn m-1 transition duration-200 ease-in-out hover:shadow-lg {setButtonStyle(tab.id, $activeTabs)}"
      on:click={setTab(tab.id)}>
    { tab.name }
  </button>
	{/each}
</div>
