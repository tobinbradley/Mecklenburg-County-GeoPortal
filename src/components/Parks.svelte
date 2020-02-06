<script>
  import { location } from '../store.js'
  import Title from './Title.svelte'
  import Resources from './Resources.svelte'
  import Table from './Table.svelte'
  import Map from './Map.svelte'
  import jsonToURL from '../js/jsonToURL.js'

  // Base table
  let parkRows = []
  let greenwayRows = []

  // Map
  let showMap = false
  let mapPoints = []

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
    fetchParks()
    fetchGreenways()
	})

  function fetchParks() {
    // reset variables
    parkRows = []
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
          parkRows.push([
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
        parkRows = parkRows
        mapPoints = mapPoints
      })
      .catch(ex => {
        console.log("parsing failed", ex);
      })
  }

  function fetchGreenways() {
    // reset variables
    greenwayRows = []

    const params = {
      columns: "trail_id, trail_surf",
      limit: "3"
    }

    fetch(`https://mcmap.org/api2/v1/nearest/greenways_union/${$location.lnglat.join(",")},4326?${jsonToURL(params)}`)
      .then(response => response.json())
      .then(data => {
        // make records for table
        data.forEach(el => {
          greenwayRows.push([
            el.trail_id,
            el.trail_surf,
            `${(el.distance / 5280).toFixed(1)} miles`
          ])
        })
      })
      .then(() => {
        greenwayRows = greenwayRows
      })
      .catch(ex => {
        console.log("parsing failed", ex);
      })
  }

</script>


<Title title="PARKS" icon="park" />

<Map showMap={showMap} mapPoints={mapPoints} toggleLayers="parks" />

<Table rows={parkRows} columns={["Park", "Address", "Distance"]} caption="10 Closest Parks" alignRight={[3]} />

<Table rows={greenwayRows} columns={["Greenway", "Surface", "Distance"]} caption="5 Closest Greenways" alignRight={[3]} />

<Resources links={resourceLinks} />
