<script>
  import { location } from '../store.js'
  import Title from './Title.svelte'
  import Table from './Table.svelte'
  import Resources from './Resources.svelte'
  import Map from './MapCommunity.svelte'
  import jsonToURL from '../js/jsonToURL.js'


  // Resources
  const resourceLinks = [
    {
      name: 'Quality of Life Explorer',
      url: 'https://mcmap.org/qol/'
    },
    {
      name: 'Download Quality of Life data on Open Mapping',
      url: 'http://maps.co.mecklenburg.nc.us/openmapping/data.html?search=quality%20of'
    }
  ]

  let rows = []
  let mapLinks = []
  const columns = ["metric", "neighborhood", "charlotte", "mecklenburg"]

  // map stuff
  let showMap = false
  let npa = null
  let npaConfig = null
  let mapTitle = null
  let npaData = null
  let mapData = null

  location.subscribe(value => {
		fetchData()
  })

  function fetchData() {
    const params = {
      columns: "sum(sum_of_area) as area, subtheme, category",
      filter: `commonpid='${$location.pid}'`,
      sort: "subtheme",
      group: "subtheme, category"
    }

    fetch(`https://mcmap.org/api2/v1/nearest/neighborhoods/${$location.lnglat.join(',')},4326?${jsonToURL({
      columns: 'id',
      geom_column: 'the_geom',
      limit: 1
    })}`)
      .then(response => response.json())
      .then(data => {
        makeTable(data[0].id)
        npa = data[0].id
      })
      .catch(ex => {
        console.log("parsing failed", ex);
      })
  }

  function makeTable(npa) {
    rows = []
    mapLinks = []
    const urls = ["./data/community-config.json", "./data/community-group.json", "./data/community-npa.json"]

    Promise.all(urls.map(url =>
      fetch(url).then(resp => resp.json())
    )).then (jsons => {
        const config = jsons[0]
        const groups = jsons[1]
        const npas = jsons[2]
        npaData = npas
        npaConfig = config
        mapData = npas["37"]
        mapTitle = config.filter(el => el.metric === "37")[0].title

        config.forEach(m => {
          rows.push([
            m.label ?  `${m.title}<span class="block text-sm">${m.label}</span>` :  m.title,
            npas[m.metric][npa] || 'N/A',
            groups.charlotte[m.metric],
            groups.mecklenburg[m.metric]
          ])
          mapLinks.push(m.metric)
        })
    }).then(() => {
      rows = rows
      mapLinks = mapLinks
    })
  }

  function handleMapLink(event) {
    showMap = true
    const config = npaConfig.filter(el => el.metric === event.detail.toString())
    mapData = npaData[event.detail.toString()]
    mapTitle = config[0].title
  }

</script>

<Title title="Community" icon="community" />

<Map showMap={showMap} mapTitle={mapTitle} mapData={mapData} mapNPA={npa} />

<Table caption="Your Neighborhood" rows={rows} columns={columns} alignRight={[2, 3, 4]} mapLinks={mapLinks} on:mapLink={handleMapLink} />

<Resources links={resourceLinks} />
