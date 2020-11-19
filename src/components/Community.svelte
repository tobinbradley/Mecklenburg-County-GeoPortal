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
  let sparklines = []
  const columns = ["metric", "neighborhood", "charlotte", "mecklenburg"]
  let highlightRow = 10

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


  // Make sparkline data array
  function makeSparklineData(years, data) {
    const sparklineData = []

    years.forEach((y, idx) => {
      if (data[idx]) {
        sparklineData.push({
          year: y,
          label: `${y}: ${data[idx]}`,
          value: data[idx].replace(/[^\d.-]/g, '')
        })
      }
    })

    // no data
    if (sparklineData.length === 0) return null

    const yearMin = Math.min.apply(Math, sparklineData.map(y => { return parseInt(y.year) }))
    const yearMax = Math.max.apply(Math, sparklineData.map(y => { return parseInt(y.year) }))


    // fill any missing values
    for (let i = yearMin + 1; i < yearMax; i++) {
      if (sparklineData.filter(el => el.year == i).length === 0) {
        sparklineData.push({
          year: i.toString(),
          label: null,
          value: null
        })
      }
    }

    sparklineData.sort((a, b) => {
      return a.year - b.year;
    })

    return sparklineData
  }


  function makeTable(npa) {
    rows = []
    mapLinks = []
    sparklines = []
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
        let thisConfig = config.filter(el => el.metric === "37")[0]
        mapTitle = thisConfig.title + ', ' + thisConfig.years[thisConfig.years.length - 1]

        config.forEach(m => {
          const npaValues = npas[m.metric][npa]

          rows.push([
            m.label ?  `${m.title}, ${m.years[m.years.length - 1]}<span class="block text-sm">${m.label}</span>` :  m.title + ', ' + m.years[m.years.length - 1],
            npaValues[npaValues.length - 1] || 'N/A',
            groups.charlotte[m.metric][groups.charlotte[m.metric].length - 1],
            groups.mecklenburg[m.metric][groups.mecklenburg[m.metric].length - 1]
          ])


          sparklines.push([
            null,
            makeSparklineData(m.years, npaValues),
            makeSparklineData(m.years, groups.charlotte[m.metric]),
            makeSparklineData(m.years, groups.mecklenburg[m.metric])
          ])
          mapLinks.push(m.metric)
        })
    }).then(() => {
      rows = rows
      mapLinks = mapLinks
      sparklines = sparklines
    })
  }

  function handleMapLink(event) {
    showMap = true
    const config = npaConfig.filter(el => el.metric === event.detail.toString())
    let idx = 0
    npaConfig.forEach((el, i) => {
      if (el.metric === event.detail.toString()) idx = i
    })
    mapData = npaData[event.detail.toString()]
    mapTitle = config[0].title + ', ' + config[0].years[config[0].years.length - 1]
    highlightRow = idx
    window.scrollTo({
      top: 720,
      behavior: 'smooth',
    })
  }

</script>

<Title title="Community" icon="community" />

<Map showMap={showMap} mapTitle={mapTitle} mapData={mapData} mapNPA={npa} />

<Table caption="Your Neighborhood" rows={rows} columns={columns} alignCenter={[2, 3, 4]} mapLinks={mapLinks} on:mapLink={handleMapLink} sparklines={sparklines} highlightRow={highlightRow} />

<Resources links={resourceLinks} />
