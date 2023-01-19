<script>
  import { toastMessage } from '../store.js'
  import { fly } from 'svelte/transition'

  let show = false
  let msg = ""

  toastMessage.subscribe(value => {
		if (msg !== $toastMessage.message) {
      if (value.loadDelay > 0) {
        setTimeout(() => {
          show = true
          if (value.dismissDelay > 0) setTimeout(() => { show = false }, value.dismissDelay)
        }, value.loadDelay)
      } else {
        show = true
        if (value.dismissDelay > 0) setTimeout(() => { show = false }, value.dismissDelay)
      }
      msg = $toastMessage.message
    }
	})

  function handleClick() {
    show = false
  }

</script>

<style>
  .toastMessage {
    max-width: 90%;
  }
</style>

{#if show}

<div
  class="toastMessage rounded border-l-4 border-white fixed z-50 right-0 bottom-0 cursor-pointer flex items-center p-4 shadow-lg mb-5 mr-5 bg-sky-800 shadow-sky-800/50"
  on:click|once={handleClick}
  on:keypress={handleClick}
  in:fly="{{ y: 200, duration: 1000 }}"
  out:fly="{{ y: 200, duration: 2000 }}"
>
  <!-- icon -->
  <div class="rounded-full bg-white mr-3 text-sky-700">
    <svg width="1.8em" height="1.8em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
      <circle cx="8" cy="4.5" r="1"/>
    </svg>
  </div>
  <!-- message -->
  <div class="text-white flex-grow">
    {@html $toastMessage.message }
  </div>
  <div>
    {#if $toastMessage.reloadButton}
      <button class="btn text-sm ml-4 leading-none border text-white border-white hover:border-transparent hover:text-sky-900 hover:bg-white transition-colors duration-200 ease-in-out" onclick="location.reload()" onkeydown="location.reload()">reload</button>
    {/if}
  </div>
</div>

{/if}
