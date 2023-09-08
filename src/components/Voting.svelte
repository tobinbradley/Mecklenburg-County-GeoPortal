<script>
  import { location } from '../store.js'
  import Title from './Title.svelte'
  import Resources from './Resources.svelte'
  import Map from './Map.svelte'
  import Representative from './Representative.svelte'
  import RecordHighlight from './RecordHighlight.svelte'
  import jsonToURL from '../js/jsonToURL.js'

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
    Promise.all([
      fetch('https://api.mcmap.org/v1/query/boe_elected_officials?sort=branch,district').then(resp => resp.json()),
      fetch(`https://api.mcmap.org/v1/intersect_point/view_political_districts/${$location.lnglat[0]},${$location.lnglat[1]},4326?columns=districttype,district`).then(resp => resp.json())
    ])
    .then(data => {
      officials = data[0]

      // national house
      nationalHouse = officials.filter(el => el.branch.indexOf('US House of Representatives') !== -1 &&
        el.district === data[1].filter(el => el.districttype === 'national_congressional')[0].district)
      // county commsion
      countyCommission = officials.filter(el => el.branch.indexOf('Board of Commissioners') !== -1 &&
        (el.district === data[1].filter(el => el.districttype === 'county_commission')[0].district || el.district === 'At-Large'))
      // school board
      countyBoard = officials.filter(el => el.branch.indexOf('Board of Education') !== -1 &&
        (el.district === data[1].filter(el => el.districttype === 'school_board')[0].district || el.district === 'At-Large'))
      // state senate
      stateSenate = officials.filter(el => el.branch.indexOf('NC State Senate') !== -1 &&
          el.district === data[1].filter(el => el.districttype === 'state_senate')[0].district)
      // state house
      stateHouse = officials.filter(el => el.branch.indexOf('NC House of Representatives') !== -1 &&
          el.district === data[1].filter(el => el.districttype === 'state_house')[0].district)
      // local
      if (data[1].filter(el => el.districttype === 'charlotte_city_council').length > 0) {
        // charlotte
        local = officials.filter(el => el.branch.indexOf('Charlotte') !== -1 &&
          (el.district === data[1].filter(el => el.districttype === 'charlotte_city_council')[0].district || el.district === 'At-Large'))
      } else if (data[1].filter(el => el.districttype === 'jurisdictions' && el.district != 'Stallings' && el.district != 'Mecklenburg').length > 0) {
        // towns
        local = officials.filter(el => el.branch.indexOf(data[1].filter(el => el.districttype === 'jurisdictions')[0].district) !== -1)
      }

      fetchPollingLocation(data[1].filter(el => el.districttype === 'voting_precincts')[0].district)

    })

  })

  function fetchPollingLocation(precno) {
    const params = {
      geom_column: "voting_precincts.the_geom",
      columns: `name,
        address,
        precno,
        st_x(st_transform(the_geom, 4326)) as lng,
        st_y(st_transform(the_geom, 4326)) as lat,
        ST_Distance(the_geom,ST_Transform(GeomFromText('POINT(${$location.lnglat[0]} ${$location.lnglat[1]})',4326), 2264)) as distance
        `,
      filter: `precno = ${precno}`
    }
    fetch(`https://api.mcmap.org/v1/query/polling_locations?` + jsonToURL(params))
      .then(response => response.json())
      .then(json => {
        pollingLocation.headline = json[0].name
        pollingLocation.sub = json[0].address
        pollingLocation.detail = `Precinct ${json[0].precno}`
        mapPoints = [{
          label: 'V',
          lngLat: [json[0].lng, json[0].lat],
          name: json[0].name,
          address: `${json[0].address}`
        }]
      })
  }


</script>

<style>
.voting-h2 {
  @apply text-center w-full text-3xl tracking-widest text-gray-600 dark:text-gray-400 pt-12 uppercase font-bold;
}
</style>


<Title title="VOTING" icon="voting" />

<Map showMap={showMap} mapPoints={mapPoints} basemapEnum="arcgis/navigation" />

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
  <Representative reps={officials.filter(el => el.branch === 'President of the United States')} />
  <Representative reps={officials.filter(el => el.branch === 'Vice President of the United States')} />
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
