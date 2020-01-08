<script>
  import { location } from '../store.js'
  import Title from './Title.svelte'
  import Table from './Table.svelte'
  import Resources from './Resources.svelte'
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
  const columns = ["metric", "neighborhood", "charlotte", "mecklenburg"]

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
      })
      .catch(ex => {
        console.log("parsing failed", ex);
      })
  }

  function makeTable(npa) {
    rows = []
    const urls = ["./data/community-config.json", "./data/community-group.json", "./data/community-npa.json"]

    Promise.all(urls.map(url =>
      fetch(url).then(resp => resp.json())
    )).then (jsons => {
        const config = jsons[0]
        const groups = jsons[1]
        const npas = jsons[2]

        config.forEach(m => {
          rows.push([
            m.label ?  `${m.title}<span class="block text-sm">${m.label}</span>` :  m.title,
            npas[m.metric][npa] || 'N/A',
            groups.charlotte[m.metric],
            groups.mecklenburg[m.metric]
          ])
        })
    }).then(() => rows = rows)
  }

</script>

<Title title="Community" icon="community" />

<Table caption="Your Neighborhood" rows={rows} columns={columns} alignRight={[2, 3, 4]} />

<Resources links={resourceLinks} />
