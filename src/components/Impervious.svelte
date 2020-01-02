<script>
  import { location } from '../store.js'
  import Title from './Title.svelte'
  import Resources from './Resources.svelte'
  import Table from './Table.svelte'
  import Map from './Map.svelte'
  import RecordHighlight from './RecordHighlight.svelte'
  import jsonToURL from '../js/jsonToURL.js'
  import { formatCommas } from '../js/formatNumbers.js'

  // Base table
  const columns = ["Category", "Surface Type", "Area"]
  const alignRight = [3]
  let rows = []

  // Map
  let showMap = false

  // Resources
  const resourceLinks = [
    {
      name: 'What is "impervious surface"?',
      url: 'https://en.wikipedia.org/wiki/Impervious_surface'
    },
    {
      name: 'Charlotte-Mecklenburg Storm Water Services',
      url: 'https://charlottenc.gov/stormwater/Pages/default.aspx'
    },
    {
      name: 'Impervious Surface data on Open Mapping',
      url: 'http://maps.co.mecklenburg.nc.us/openmapping/data.html?search=impervious'
    }
  ]

  // Total impervious surface
  let imperviousTotal = 0

  location.subscribe(value => {
		fetchData()
	})

  function fetchData() {
    // reset variables
    rows = []
    imperviousTotal = 0

    const params = {
      columns: "sum(sum_of_area) as area, subtheme, category",
      filter: `commonpid='${$location.pid}'`,
      sort: "subtheme",
      group: "subtheme, category"
    }

    fetch(`https://mcmap.org/api2/v1/query/impervious_surface_area?${jsonToURL(params)}`)
      .then(response => response.json())
      .then(data => {
        // make records for table
        data.forEach(el => {
          rows.push([
            el.category.charAt(0).toUpperCase() + el.category.slice(1),
            el.subtheme,
            `${formatCommas(el.area)} Sq. Ft.`
          ])
          // set impervious total
          imperviousTotal += el.area
        })
      })
      .then(() => {
        rows = rows
      })
      .catch(ex => {
        console.log("parsing failed", ex);
      })
  }

</script>

<Title title="IMPERVIOUS SURFACE" icon="impervious" />

<Map showMap={showMap} toggleLayers="impervious"  />

<div class="flex flex-row flex-wrap justify-around">
  <RecordHighlight top="You have" sub="of Impervious Surface" headline={formatCommas(imperviousTotal) + ' Sq. Ft.'} />
</div>

<Table rows={rows} columns={columns} alignRight={alignRight} />

<Resources links={resourceLinks} />
