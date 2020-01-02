<script>
import RecordHighlight from './RecordHighlight.svelte'
export let reps = []
</script>

{#each reps as item}
  <RecordHighlight
    top={item.branch}
    headline={item.representative}
    sub={item.link}
    detail={`${item.address1}<br>${item.address2}<br>${item.phone}`}
  />
{/each}