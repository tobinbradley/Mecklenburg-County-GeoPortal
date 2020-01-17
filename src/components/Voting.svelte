<script>
  import { location } from '../store.js'
  import Title from './Title.svelte'
  import Resources from './Resources.svelte'
  import Table from './Table.svelte'
  import Map from './Map.svelte'
  import Representative from './Representative.svelte'
  import RecordHighlight from './RecordHighlight.svelte'
  import jsonToURL from '../js/jsonToURL.js'
  import { formatCommas } from '../js/formatNumbers.js'

  // Map
  let showMap = false

  // Resources
  const resourceLinks = [
    {
      name: 'Mecklenburg County Board of Elections',
      url: 'https://www.mecknc.gov/BOE/Pages/default.aspx'
    },
    {
      name: 'Voting Precincts and Polling Locations on Open Mapping',
      url: 'http://maps.co.mecklenburg.nc.us/openmapping/data.html?search=vot'
    },
    {
      name: 'Districts on Open Mapping',
      url: 'http://maps.co.mecklenburg.nc.us/openmapping/data.html?search=districts'
    }
  ]

  // Local data catchers
  let officials = null
  let nationalHouse = []
  let stateSenate = []
  let stateHouse = []
  let countyCommission = []
  let countyBoard = []
  let local = []
  let pollingLocation = {
    headline: null,
    sub: null,
    detail: null
  }
  let mapPoints = []

  location.subscribe(value => {
    // reset variables
    officials = null
    pollingLocation = {
      headline: null,
      sub: null,
      detail: null
    };
    [nationalHouse, stateSenate, stateHouse, countyCommission, countyBoard, local].forEach(item => {
      item = []
    })
    mapPoints = []

    fetch('https://mcmap.org/api2/v1/query/boe_elected_officials')
      .then(response => response.json())
      .then(json => {
        officials = json
      }).then(() => {
      // kick off other requests after officials in hand
      fetchNational($location.lnglat[0], $location.lnglat[1])
      fetchState($location.lnglat[0], $location.lnglat[1])
      fetchCounty($location.lnglat[0], $location.lnglat[1])
      fetchLocal($location.lnglat[0], $location.lnglat[1])
    })

    fetchPollingLocation($location.lnglat[0], $location.lnglat[1])

  })

  function fetchPollingLocation(lng, lat) {
    const params = {
      geom_column: "voting_precincts.the_geom",
      columns: `pl.name,
        pl.address,
        voting_precincts.precno,
        st_x(st_transform(pl.the_geom, 4326)) as lng,
        st_y(st_transform(pl.the_geom, 4326)) as lat,
        ST_Distance(pl.the_geom,ST_Transform(GeomFromText('POINT(${lng} ${lat})',4326), 2264)) as distance
        `,
      filter: 'voting_precincts.precno = pl.precno'
    }
    fetch(`https://mcmap.org/api2/v1/intersect_point/voting_precincts%2C%20polling_locations%20pl/${lng},${lat},4326?` + jsonToURL(params))
      .then(response => response.json())
      .then(json => {
        pollingLocation.headline = json[0].name
        pollingLocation.sub = json[0].address
        pollingLocation.detail = `Precinct ${json[0].precno}`
        mapPoints.push({
          label: 'V',
          lngLat: [json[0].lng, json[0].lat],
          name: json[0].name,
          address: `${json[0].address}`
        })
      })
  }

  function fetchNational(lng, lat) {
    const params = {
      geom_column: "the_geom",
      columns: "district"
    }
    fetch(`https://mcmap.org/api2/v1/intersect_point/national_congressional/${lng},${lat},4326?` + jsonToURL(params))
      .then(response => response.json())
      .then(json => {
        nationalHouse = officials.filter(el => el.branch.indexOf('US House of Representatives') !== -1 && el.district === json[0].district)
      })
  }

  function fetchState(lng, lat) {
    fetch(`https://mcmap.org/api2/v1/intersect_point/state_senate/${lng},${lat},4326?` +
        jsonToURL({
          geom_column: "the_geom",
          columns: "senate as district"
        })
      )
      .then(response => response.json())
      .then(json => {
        stateSenate = officials.filter(el => el.branch.indexOf('NC State Senate') !== -1 && el.district === json[0].district)
      })

    fetch(`https://mcmap.org/api2/v1/intersect_point/state_house/${lng},${lat},4326?` +
        jsonToURL({
          geom_column: "the_geom",
          columns: "house as district"
        })
      )
      .then(response => response.json())
      .then(json => {
        stateHouse = officials.filter(el => el.branch.indexOf('NC House of Representatives') !== -1 && el.district === json[0].district)
      })
  }

  function fetchCounty(lng, lat) {
    fetch(`https://mcmap.org/api2/v1/intersect_point/voting_precincts/${lng},${lat},4326?` +
        jsonToURL({
          geom_column: "the_geom",
          columns: "cc, school"
        })
      )
      .then(response => response.json())
      .then(json => {
        countyCommission = officials.filter(el => el.branch.indexOf('Board of Commissioners') !== -1 &&
          (el.district === json[0].cc || el.district === 'At-Large'))
        countyBoard = officials.filter(el => el.branch.indexOf('Board of Education') !== -1 &&
          (el.district === json[0].school || el.district === 'At-Large'))
      })
  }

  function fetchLocal(lng, lat) {
    fetch(`https://mcmap.org/api2/v1/intersect_point/city_council/${lng},${lat},4326?` +
        jsonToURL({
          geom_column: "the_geom",
          columns: "citydist as district"
        })
      )
      .then(response => response.json())
      .then(json => {
        if (json.length > 0) {
          local = officials.filter(el => el.branch.indexOf('Charlotte') !== -1 &&
            (el.district === json[0].district.toString() || el.district === 'At-Large' || el.district === ''))
        } else {
          fetchLocalTowns(lng, lat)
        }
      })
  }

  function fetchLocalTowns(lng, lat) {
    fetch(`https://mcmap.org/api2/v1/intersect_point/jurisdictions/${lng},${lat},4326?` +
        jsonToURL({
          geom_column: "the_geom",
          columns: "name as city"
        })
      )
      .then(response => response.json())
      .then(json => {
        if (json.length > 0 && json[0].city !== "Stallings" && json[0].city !== "Mecklenburg") {
          local = officials.filter(el => el.branch.indexOf(json[0].city) !== -1)
        }
      })
  }

</script>

<style>
.voting-h2 {
  @apply text-center w-full text-3xl tracking-widest text-gray-600 pt-12 uppercase font-bold;
}
</style>


<Title title="VOTING" icon="voting" />

<Map showMap={showMap} mapPoints={mapPoints} />

<!-- Polling Location -->

<div class="flex flex-row flex-wrap justify-around print:block">
  <RecordHighlight
    top="Your Polling Location is"
    headline={pollingLocation.headline}
    sub={pollingLocation.sub}
    detail={pollingLocation.detail}
  />
</div>

{#if officials}

<!-- National -->
<div class="flex flex-row flex-wrap justify-around print:block">
  <h2 class="voting-h2">National</h2>
  <Representative reps={officials.filter(el => el.branch === 'US Senate')} />
  <Representative reps={nationalHouse} />
</div>

<!-- State -->
<div class="flex flex-row flex-wrap justify-around print:block">
  <h2 class="voting-h2">State</h2>
  <Representative reps={officials.filter(el => el.branch.indexOf('Governor') !== -1)} />
  <Representative reps={stateSenate} />
  <Representative reps={stateHouse} />
</div>

<!-- County -->
<div class="flex flex-row flex-wrap justify-around print:block">
  <h2 class="voting-h2">County</h2>
  <Representative reps={countyCommission} />
  <Representative reps={countyBoard} />
</div>

<!-- Local -->
<div class="flex flex-row flex-wrap justify-around print:block">
  <h2 class="voting-h2">Local</h2>
  <Representative reps={local} />
</div>

{/if}

<Resources links={resourceLinks} />
