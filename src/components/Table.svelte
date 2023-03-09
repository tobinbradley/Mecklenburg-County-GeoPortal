<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  export let caption = null
  export let footer = null
  export let columns
  export let rows
  export let alignRight = []
  export let alignCenter = []

  function textAlign(idx) {
    if (alignRight.indexOf(idx + 1) !== -1) {
      return 'text-right'
    }
    if (alignCenter.indexOf(idx + 1) !== -1) {
      return 'text-center'
    }
    return ''
  }

</script>


<div class="w-full pt-10 pb-5">
  <table class="table-component table-auto w-full">
    {#if caption}
    <caption class="text-left text-lg md:text-xl font-bold uppercase">{@html caption }</caption>
    {/if}

    {#if columns}
    <thead>
      <tr class="border-b-2 border-slate-500">
        {#each columns as column, i}
        <th class="text-left {textAlign(i)}">{column}</th>
        {/each}
      </tr>
    </thead>
    {/if}

    {#if rows}
    <tbody>
      {#each rows as row, idx}
        <tr class="transition-colors duration-200 ease-in-out}">
          {#each row as elem, i}
            <td data-label="{ columns[i] }" class="{textAlign(i)}">
              {@html elem }
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
    {/if}

  </table>

  {#if footer}
  <div class=" text-sm text-right pr-4">
    {@html footer}
  </div>
  {/if}
</div>
