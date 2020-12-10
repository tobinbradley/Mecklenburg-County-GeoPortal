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
    width: 400px;
    max-width: 90%;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>

{#if show}

<div
  class="toastMessage fixed z-50 cursor-pointer flex items-center py-2 px-3 shadow-md mb-2 border-l-4
    {$toastMessage.messageType === "error" ? 'bg-red-600 border-red-800' : ''}
    {$toastMessage.messageType === "warning" ? 'bg-orange-600 border-orange-800' : ''}
    {$toastMessage.messageType === "info" ? 'bg-blue-600 border-blue-800' : ''}
    {$toastMessage.messageType === "success" ? 'bg-green-600 border-green-800' : ''}"
  on:click|once={handleClick}
  in:fly="{{ y: 200, duration: 1000 }}"
  out:fly="{{ y: 200, duration: 2000 }}"
>
  <!-- icon -->
  <div class="rounded-full bg-white mr-3
    {$toastMessage.messageType === "error" ? 'text-red-600' : ''}
    {$toastMessage.messageType === "warning" ? 'text-orange-600' : ''}
    {$toastMessage.messageType === "info" ? 'text-blue-600' : ''}
    {$toastMessage.messageType === "success" ? 'text-green-600' : ''}"
  >
    <svg width="1.8em" height="1.8em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {#if $toastMessage.messageType === "warning"}
        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
      {/if}
      {#if $toastMessage.messageType === "success"}
        <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
      {/if}
      {#if $toastMessage.messageType === "info"}
        <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
        <circle cx="8" cy="4.5" r="1"/>
      {/if}
      {#if $toastMessage.messageType === "error"}
        <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
        <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
      {/if}
    </svg>
  </div>
  <!-- message -->
  <div class="text-white">
    {@html $toastMessage.message }
  </div>
</div>

{/if}