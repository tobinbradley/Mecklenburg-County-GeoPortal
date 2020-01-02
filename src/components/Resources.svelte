<script>
  export let links = []
</script>

<style>
  .columns {
    column-count: 2;
    column-gap: 40px;
  }

  @media screen and (max-width: 639px) {
    .columns {
      column-count: 1;
    }
  }
</style>

<div class="tab-links print:hidden w-full pt-10">
  <h4 class="text-lg pb-2 uppercase font-bold">resources</h4>
  <ul class="columns">

    {#each links as { name, url }}
      <li class="pb-1">
        <a target="_blank" rel="noopener" href="{url}">{name}</a>
      </li>
    {/each}

  </ul>
</div>