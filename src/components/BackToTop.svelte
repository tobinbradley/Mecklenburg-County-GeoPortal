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
    class="btn transition duration-200 ease-in-out bg-orange-700 hover:bg-orange-800 hover:shadow-lg text-white fixed bottom-0 right-0 mb-3 mr-3 px-3 py-3"
  >
    <svg class="fill-current h-3 w-4"><use xlink:href="#icon-arrow-up"></use></svg>
  </button>

  <symbol id="icon-arrow-up" viewBox="0 0 32 32">
    <title>arrow-up</title>
    <path d="M16 1l-15 15h9v16h12v-16h9z"></path>
  </symbol>
{/if}