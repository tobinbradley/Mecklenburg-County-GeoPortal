<script>
  import { location } from '../store.js'
  import Title from './Title.svelte'
  import Resources from './Resources.svelte'
  import Table from './Table.svelte'
  import Map from './Map.svelte'
  import jsonToURL from '../js/jsonToURL.js'

  // Base table
  const columns = ["Park", "Address", "Distance"]
  const alignRight = [3]
  let rows = []

  // Map
  let showMap = false
  let mapPoints = []
  let focusPoint = null

  // Resources
  const resourceLinks = [
    {
      name: 'Mecklenburg County Park and Recreation',
      url: 'https://www.mecknc.gov/ParkandRec/Pages/Home.aspx'
    },
    {
      name: 'Huntersville Parks and Recreation',
      url: 'https://www.huntersville.org/162/Parks-Recreation'
    },
    {
      name: 'Park data on Open Mapping',
      url: 'http://maps.co.mecklenburg.nc.us/openmapping/data.html?search=park'
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
      columns: "name, address, city, st_x(st_transform(geom, 4326)) as lng, st_y(st_transform(geom, 4326)) as lat",
      limit: "10"
    }

    fetch(`https://mcmap.org/api2/v1/nearest/parks_all/${$location.lnglat.join(",")},4326?${jsonToURL(params)}`)
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
            label: 'P',
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

</script>


<Title title="PARKS" icon="park" />

<Map showMap={showMap} mapPoints={mapPoints} focusPoint={focusPoint} />

<Table rows={rows} columns={columns} caption="10 Closest Parks" alignRight={alignRight} />

<Resources links={resourceLinks} />
