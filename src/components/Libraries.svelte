<script>
  import { location } from '../store.js'
  import Title from './Title.svelte'
  import Resources from './Resources.svelte'
  import Table from './Table.svelte'
  import Map from './Map.svelte'
  import jsonToURL from '../js/jsonToURL.js'

  // Base table
  const columns = ["Library", "Address", "Distance"]
  const alignRight = [3]
  let rows = []

  // Map
  let showMap = false
  let mapPoints = []
  let focusPoint = null

  // Resources
  const resourceLinks = [
    {
      name: 'Charlotte Mecklenburg Library',
      url: 'https://www.cmlibrary.org/'
    },
    {
      name: 'Library data on Open Mapping',
      url: 'http://maps.co.mecklenburg.nc.us/openmapping/data.html?search=libraries'
    }
  ]

  location.subscribe(value => {
		fetchData()
	})

  function fetchData() {
    // reset variables
    rows = []
    mapPoints = []

    const params = {
      geom_column: "the_geom",
      columns: "name, address, city, st_x(st_transform(the_geom, 4326)) as lng, st_y(st_transform(the_geom, 4326)) as lat",
      limit: "5"
    }

    fetch(`https://mcmap.org/api2/v1/nearest/libraries/${$location.lnglat.join(",")},4326?${jsonToURL(params)}`)
      .then(response => response.json())
      .then(data => {
        // make records for table
        data.forEach(el => {
          rows.push([
            el.name,
            `${el.address}, ${el.city}`,
            `${(el.distance / 5280).toFixed(1)} miles`
          ])
          mapPoints.push({
            label: 'L',
            lngLat: [el.lng, el.lat],
            name: el.name,
            address: `${el.address}, ${el.city}`
          })
        })
      })
      .then(() => {
        rows = rows
        mapPoints = mapPoints
      })
      .catch(ex => {
        console.log("parsing failed", ex);
      })
  }

  function handleMapOff(event) {
    showMap = false
  }

</script>


<Title title="LIBRARIES" icon="library" />

<Map showMap={showMap} mapPoints={mapPoints} focusPoint={focusPoint} on:mapOff={handleMapOff} />

<Table rows={rows} columns={columns} caption="5 Closest Libraries" alignRight={alignRight} />

<Resources links={resourceLinks} />
