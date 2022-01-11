<script>
  import { fade } from 'svelte/transition'
  export let track

  let visible = false

  new IntersectionObserver(entries => {
    entries[0].intersectionRatio > 0 ?
      visible = false :
      visible = true
  }).observe(track)

  function scrollUp() {
    document.body.scrollIntoView({behavior: "smooth"})
  }
</script>

{#if visible}
  <button
    aria-label="Back to Top"
    transition:fade
    on:click={scrollUp}
    class="btn transition duration-200 ease-in-out shadow bg-orange-600 shadow-orange-600/50 hover:bg-orange-700 hover:shadow-orange-700/50 hover:shadow-lg text-white fixed bottom-0 right-0 mb-5 mr-5 px-3 p-3"
  >
    <svg class="fill-current h-5 w-6"><use xlink:href="#icon-arrow-up"></use></svg>
  </button>

  <symbol id="icon-arrow-up" viewBox="0 0 32 32">
    <title>arrow-up</title>
    <path d="M16 1l-15 15h9v16h12v-16h9z"></path>
  </symbol>
{/if}
