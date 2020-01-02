<script>
  import { location } from '../store.js'
  import Title from './Title.svelte'
  import Resources from './Resources.svelte'
  import Table from './Table.svelte'
  import Map from './Map.svelte'
  import RecordHighlight from './RecordHighlight.svelte'
  import jsonToURL from '../js/jsonToURL.js'
  import { formatCommas } from '../js/formatNumbers.js'

  // Soil table
  const columns = ["Soil Type", "Group", "Description"]
  const alignRight = []
  let rows = []

  // check stuff
  let floodplainReport = {
    top: '',
    detail: '',
    headline: ''
  }
  let waterQualityReport = JSON.parse(JSON.stringify(floodplainReport))
  let watershedReport = JSON.parse(JSON.stringify(floodplainReport))
  let districtReport = JSON.parse(JSON.stringify(floodplainReport))

  // Map
  let showMap = false

  // Resources
  const resourceLinks = [
    {
      name: 'What is a "floodplain"?',
      url: 'https://en.wikipedia.org/wiki/Floodplain'
    },
    {
      name: 'What is a "watershed"?',
      url: 'https://en.wikipedia.org/wiki/Watershed'
    },
    {
      name: 'Storm Water Services',
      url: 'https://charlottenc.gov/stormwater/Pages/default.aspx'
    },
    {
      name: 'Floodplain data on Open Mapping',
      url: 'http://maps.co.mecklenburg.nc.us/openmapping/data.html?search=flood'
    },
    {
      name: 'Watershed data on Open Mapping',
      url: 'http://maps.co.mecklenburg.nc.us/openmapping/data.html?search=watershed'
    },
    {
      name: 'Storm Water data on Open Mapping',
      url: 'http://maps.co.mecklenburg.nc.us/openmapping/data.html?search=storm'
    }
  ]

  // Total impervious surface
  let imperviousTotal = 0

  location.subscribe(value => {
		fetchData()
  })

  function fetchData() {
    // reset catchers
    [floodplainReport, waterQualityReport, watershedReport, districtReport].forEach(item => {
      item = {
        top: '',
        detail: '',
        headline: ''
      }
    })
    rows = []

    soils($location.groundpid)
    floodplain($location.groundpid)
    waterqualitybuffer($location.groundpid)
    district($location.groundpid)
    watershed($location.lnglat[0], $location.lnglat[1])
  }

  //***************************************************************
  // district
  //***************************************************************
  function watershed(lng, lat) {
    const params = {
      columns: "name,type,subarea",
      geom_column: "the_geom",
      limit: 1
    }

    fetch(`https://mcmap.org/api2/v1/intersect_point/watersheds/${lng},${lat},4326?${jsonToURL(params)}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const warning = data[0].type.length > 1 ?
            `This is a <a href="http://charlottenc.gov/StormWater/Regulations/Documents/WatershedRulesSummary.pdf" target="_blank"  rel="noopener">${data[0].type} watershed (${data[0].subarea})</a>.<br>`
            : ''
          watershedReport = {
            top: 'This property is in the',
            detail: warning + 'A watershed, or drainage basin, is an area of land where all surface water converges to a single point at a lower elevation, usually the exit of the basin such as a river, lake, or wetland.',
            headline: data[0].name.toUpperCase() + ' WATERSHED'
          }
        }
      })
      .catch(ex => {
        console.log("parsing failed", ex);
      })
  }

  //***************************************************************
  // district
  //***************************************************************
  function district(pid) {
    const params = {
      columns: "type, name",
      filter: `tax_parcels.pid = '${
        pid
      }' and post_construction_layers.type in ('TRANSIT CORRIDOR', 'BUSINESS CORRIDOR') `,
      geom_column_from: "the_geom",
      geom_column_to: "the_geom"
    }

    fetch(`https://mcmap.org/api2/v1/intersect_feature/tax_parcels/post_construction_layers?${jsonToURL(params)}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          districtReport = {
            top: 'This property is in a',
            detail: 'PCCO mitigation options apply. For more information, please call <a href="tel:+7044325571">704.432.5571</a>.',
            headline: 'DISTRESSED BUSINESS DISTRICT'
          }
        } else {
          districtReport = {
            top: 'This property is not in a distressed business district.',
            detail: null,
            headline: null
          }
        }
      })
      .catch(ex => {
        console.log("parsing failed", ex);
      })
  }

  //***************************************************************
  // water quality buffer
  //***************************************************************
  function waterqualitybuffer(pid) {
    const params = {
      columns: "distinct type, label",
      filter: `tax_parcels.pid = '${pid}'`,
      geom_column_from: "the_geom",
      geom_column_to: "the_geom"
    }

    fetch(`https://mcmap.org/api2/v1/intersect_feature/tax_parcels/water_quality_buffers?${jsonToURL(params)}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          waterQualityReport = {
            top: 'This property is in a',
            detail: `The buffer(s) are: <strong>${data.map(el => el.label + ' ' + el.type).join(', ')}</strong>. Special restrictions may apply. For more information, please call <a href="tel:+9807214191">980.721.4191</a> for existing single-family lots and those projects not needing a grading permit or <a href="tel:+7044325570">704.432.5570</a> for other projects.`,
            headline: 'WATER QUALITY BUFFER'
          }
        } else {
          waterQualityReport = {
            top: 'This property is not in a water quality buffer.',
            detail: null,
            headline: null
          }
        }
      })
      .catch(ex => {
        console.log("parsing failed", ex);
      })
  }

  //***************************************************************
  // Floodplain
  //***************************************************************
  function floodplain(pid) {
    const params = {
      columns: "view_regulated_floodplains.gid",
      filter: `tax_parcels.pid = '${pid}'`,
      geom_column_from: "the_geom",
      geom_column_to: "the_geom"
    }

    fetch(`https://mcmap.org/api2/v1/intersect_feature/tax_parcels/view_regulated_floodplains?${jsonToURL(params)}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          floodplainReport = {
            top: 'This property is in a',
            detail: 'Special restrictions may apply. For more information, please call <a href="tel:7043363728">704.336.3728</a>.',
            headline: 'REGULATED FLOODPLAIN'
          }
        } else {
          floodplainReport = {
            top: 'This property is not in a regulated floodplain.',
            detail: null,
            headline: null
          }
        }
      })
      .catch(ex => {
        console.log("parsing failed", ex);
      })
  }

  //***************************************************************
  // Soils
  //***************************************************************
  function soils(pid) {
    rows = []

    const params = {
      columns: "distinct name,description,hydrologic_group",
      filter: `tax_parcels.pid = '${pid}'`,
      geom_column_from: "the_geom",
      geom_column_to: "the_geom"
    }

    fetch(`https://mcmap.org/api2/v1/intersect_feature/tax_parcels/soil?${jsonToURL(params)}`)
      .then(response => response.json())
      .then(data => {
        // make records for table
        data.forEach(el => {
          rows.push([
            el.name,
            el.description,
            el.hydrologic_group
          ])
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

<Title title="Environment" icon="environment" />

<Map showMap={showMap} toggleLayers="environment"  />

<div class="flex flex-row flex-wrap justify-around print:block">
  <RecordHighlight {...floodplainReport} />
  <RecordHighlight {...waterQualityReport} />
  <RecordHighlight {...districtReport} />
  <RecordHighlight {...watershedReport} />
</div>

<Table caption="Soil Types" rows={rows} columns={columns} alignRight={alignRight} />

<Resources links={resourceLinks} />
