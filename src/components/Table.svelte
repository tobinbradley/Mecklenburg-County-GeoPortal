<script>
  import { createEventDispatcher } from 'svelte'
  import Sparkline from "./Sparkline.svelte"

  const dispatch = createEventDispatcher()
  export let caption = null
  export let columns
  export let rows
  export let alignRight = []
  export let alignCenter = []
  export let highlightRow = -1

  export let mapLinks = null
  export let sparklines = null

  function textAlign(idx) {
    if (alignRight.indexOf(idx + 1) !== -1) {
      return 'text-right'
    }
    if (alignCenter.indexOf(idx + 1) !== -1) {
      return 'text-center'
    }
    return ''
  }

  function highlight(idx) {
    if (idx == highlightRow) {
      return 'row-highlight'
    }
    return ''
  }

  const mapLinkClick = (idx) => () => {
    if (mapLinks) dispatch('mapLink', idx)
  }

</script>

<style>
.mapLink {
  @apply  cursor-pointer;
}
.mapLink:hover {
  @apply bg-blue-200;
}

.table-component tr:nth-child(even) {
  @apply bg-gray-100;
}

.table-component tr:nth-child(even).mapLink:hover {
  @apply bg-blue-200;
}

.table-component tr.row-highlight {
  @apply bg-orange-300;
}

@media screen and (max-width: 639px) {
  .table-component thead { display: none; }

  .table-component tr {
    display: block;
    margin: 0.75rem 0;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border-radius: .25rem;
    /* @apply block my-3 shadow rounded; */
  }

  .table-component td {
    display: block;
    text-align: right;
    font-size: .875rem;
    /* @apply block text-right; */
  }

  .table-component td:before {
    content: attr(data-label);
    text-transform: uppercase;
    float: left;
    font-weight: bold;
    color: #718096;
    font-size: .875rem;
    /* @apply uppercase float-left font-bold; */
  }


}
</style>

<div class="w-full pt-10 pb-5">
  <table class="table-component table-auto w-full">
    {#if caption}
    <caption class="text-left text-lg md:text-xl font-bold uppercase">{@html caption }</caption>
    {/if}

    {#if columns}
    <thead>
      <tr class="border-b-2 border-blue-500">
        {#each columns as column, i}
        <th class="uppercase text-left px-4 py-2 text-gray-600 {textAlign(i)}">{column}</th>
        {/each}
      </tr>
    </thead>
    {/if}

    {#if rows}
    <tbody>
      {#each rows as row, idx}
        <tr class="transition-colors duration-200 ease-in-out {highlight(idx, highlightRow)}" class:mapLink="{mapLinks}" on:click={mapLinkClick(mapLinks[idx])}>
          {#each row as elem, i}
            <td data-label="{ columns[i] }" class="px-4 py-2 {textAlign(i)}">
              {#if sparklines && sparklines[idx][i] && sparklines[idx][i].length > 1}
                <Sparkline data={sparklines[idx][i]} idlink={`sparkline${idx}-${i}`} label={elem} />
              {:else}
                {@html elem }
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
    {/if}
  </table>
</div>
