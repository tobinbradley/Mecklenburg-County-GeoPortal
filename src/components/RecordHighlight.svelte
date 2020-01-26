<script>
  export let top = null
  export let headline = null
  export let sub = null
  export let detail = null
</script>

<style>
  .record-highlight {
    width: 450px;
  }
</style>

<div class="record-highlight text-center px-2 py-8 max-w-full report-highlight print:mx-auto">
  {#if top}
  <p class="text-xl md:text-2xl">{top}</p>
  {/if}

  {#if headline}
  <h3 class="text-2xl md:text-4xl font-bold text-orange-600">{headline}</h3>
  {/if}

  {#if sub}
  <p class="text-lg md:text-xl">{@html sub}</p>
  {/if}

  {#if detail}
  <p>{@html detail}</p>
  {/if}
</div>