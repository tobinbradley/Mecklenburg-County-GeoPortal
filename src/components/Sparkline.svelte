<script>
  import sparkline from "../js/sparkline.js"

  export let data
  export let label

  let svgElement


  const options = {
    onmousemove(event, datapoint) {
      var svg = findClosest(event.target, "svg");
      var tooltip = svg.nextElementSibling;

      tooltip.hidden = false;
      tooltip.textContent = datapoint.label
      tooltip.style.top = `${event.offsetY - 10}px`;
      tooltip.style.left = `${event.offsetX + 20}px`;
    },

    onmouseout() {
      var svg = findClosest(event.target, "svg");
      var tooltip = svg.nextElementSibling;

      tooltip.hidden = true;
    }
  }

  function findClosest(target, tagName) {
    if (target.tagName === tagName) {
      return target;
    }

    while ((target = target.parentNode)) {
      if (target.tagName === tagName) {
        break;
      }
    }

    return target;
  }

   $: makeSparkline(data, svgElement)


   function makeSparkline(x, elem) {
    if (elem) {
      sparkline(elem, x, options)
    }
   }


</script>

<style>
.tooltip {
  @apply absolute shadow px-2 py-1 rounded bg-white text-sm whitespace-no-wrap z-0;
}
</style>

<div class="relative inline-block">
  <div>{@html label }</div>
  <svg bind:this={svgElement} class="inline" width="100" height="20" stroke-width="2" stroke="#2C5282" fill="#90CDF4"></svg>
  <span class="tooltip" hidden="true"></span>
</div>