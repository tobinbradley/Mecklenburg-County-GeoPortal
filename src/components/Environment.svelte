<script>
  import { location } from '../store.js'
  import Title from './Title.svelte'
  import Resources from './Resources.svelte'
  import Table from './Table.svelte'
  import Map from './Map.svelte'
  import RecordHighlight from './RecordHighlight.svelte'
  import jsonToURL from '../js/jsonToURL.js'

  // Soil table
  const columns = ["Soil Type", "Group", "Description"]
  const alignRight = []
  let rows = []

  // check stuff
  let floodplainReport = {
    top: '',
    detail: '',
    headline: '',
    sub: ''
  }
  let waterQualityReport = JSON.parse(JSON.stringify(floodplainReport))
  let watershedReport = JSON.parse(JSON.stringify(floodplainReport))
  let districtReport = JSON.parse(JSON.stringify(floodplainReport))
  let brownfieldReport = JSON.parse(JSON.stringify(floodplainReport))
  let conservationReport = structuredClone(floodplainReport)

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
      name: 'What is a "brownfield"?',
      url: 'https://en.wikipedia.org/wiki/Brownfield_land'
    },
    {
      name: 'Storm Water Services',
      url: 'https://charlottenc.gov/stormwater/Pages/default.aspx'
    },
    {
      name: 'Storm Water Regulations',
      url: 'https://charlottenc.gov/StormWater/Regulations/Pages/default.aspx'
    },
    {
      name: 'NC DEQ Brownfields Program',
      url: 'https://deq.nc.gov/about/divisions/waste-management/brownfields-program'
    },
    {
      name: 'City of Charlotte Water Quality Monitoring',
      url: 'https://www.charlottenc.gov/Services/Stormwater/Surface-Water-Quality/Monitoring'
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
    brownfields($location.groundpid)
    watershed($location.lnglat[0], $location.lnglat[1])
    conservation($location.groundpid)
  }

  //***************************************************************
  // watershed
  //***************************************************************
  function watershed(lng, lat) {
    const params = {
      columns: "name,type,subarea",
      geom_column: "the_geom",
      limit: 1
    }

    fetch(`https://api.mcmap.org/v1/intersect_point/watersheds/${lng},${lat},4326?${jsonToURL(params)}`)
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

    fetch(`https://api.mcmap.org/v1/intersect_feature/tax_parcels/post_construction_layers?${jsonToURL(params)}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          districtReport = {
            top: 'This property is in a',
            sub: 'PCSO Mitigation Options Apply',
            detail: 'Post-Construction Stormwater Control ordinances ensure that new developments are designed to minimize impacts to surface water quality. For more information, please refer to the <a href="https://charlottenc.gov/stormwater/regulations/Pages/default.aspx" rel="noreferrer" target="_blank">PSCO regulations</a> or call <a href="tel:+7043367600">704.336.7600</a>.',
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
  // brownfields
  //***************************************************************
  function brownfields(pid) {
    const params = {
      columns: "rec_docs_link,bf_name",
      filter: `tax_parcels.pid = '${
        pid
      }'`,
      geom_column_from: "the_geom",
      geom_column_to: "geom"
    }

    fetch(`https://api.mcmap.org/v1/intersect_feature/tax_parcels/nc_deq_brownfields?${jsonToURL(params)}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          brownfieldReport = {
            top: 'This property contains a',
            sub: 'Special Restrictions May Apply',
            detail: `See NC DEQ <a href="${data[0].rec_docs_link.replace('.aspx:dbid', '.aspx?dbid')}" rel="noopener" target="_blank">recorded documents for ${data[0].bf_name} brownfield</a> for details. For more information, please contact the North Carolina Department of Environmental Quality at <a href="tel:+8776236748">877.623.6748</a>.`,
            headline: 'BROWNFIELD'
          }
        } else {
          brownfieldReport = {
            top: 'This property does not contain a brownfield.',
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
  // conservation easement
  //***************************************************************
  function conservation(pid) {
    const params = {
      columns: "id",
      filter: `tax_parcels.pid = '${
        pid
      }'`,
      geom_column_from: "the_geom",
      geom_column_to: "geom"
    }

    fetch(`https://api.mcmap.org/v1/intersect_feature/tax_parcels/stormwater_conservation_easements?${jsonToURL(params)}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          brownfieldReport = {
            top: 'This property has a',
            sub: 'No Mowing, No Cutting, No Debris Dumping, No Structures',
            detail: `Conservation easements help protect stream and wetland restoration projects that focus on
              improving water quality and ecosystems and decrease potential flooding. For more information about
              the conservation easement on your property and where it is located, please contact Jacey Meador at
              <a href="email:Jacey.Meador@charlottenc.gov">Jacey.Meador@charlottenc.gov</a>.`,
            headline: 'CONSERVATION EASEMENT'
          }
        } else {
          brownfieldReport = {
            top: 'This property does not contain a conservation easement.',
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

    fetch(`https://api.mcmap.org/v1/intersect_feature/tax_parcels/water_quality_buffers?${jsonToURL(params)}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          waterQualityReport = {
            top: 'This property is in a',
            sub: 'Special Restrictions May Apply',
            detail: `The buffer(s) are: <strong>${data.map(el => el.label + ' ' + el.type).join(', ')}</strong>. Water Quality requlations are focused on the goal of improving the quality and usability of surface waters such as streams and lakes. For more information, please call <a href="tel:+7043367600">704.336.7600</a>.`,
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

    fetch(`https://api.mcmap.org/v1/intersect_feature/tax_parcels/view_regulated_floodplains?${jsonToURL(params)}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          floodplainReport = {
            top: 'This property is in a',
            sub: 'Special Restrictions May Apply',
            detail: 'For more information, please call <a href="tel:+7043367600">704.336.7600</a>.',
            headline: 'REGULATED FLOODPLAIN'
          }
        } else {
          floodplainReport = {
            top: 'This property is not in a regulated floodplain.',
            detail: null,
            sub: null,
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

    fetch(`https://api.mcmap.org/v1/intersect_feature/tax_parcels/soil?${jsonToURL(params)}`)
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

<Map showMap={showMap} toggleLayers="environment" basemapEnum="arcgis/outdoor" />

<div class="flex flex-row flex-wrap justify-around print:block">
  <RecordHighlight {...floodplainReport} />
  <RecordHighlight {...waterQualityReport} />
  <RecordHighlight {...districtReport} />
  <RecordHighlight {...brownfieldReport} />
  <RecordHighlight {...watershedReport} />
  <RecordHighlight {...conservationReport} />
</div>

<Table caption="Soil Types" rows={rows} columns={columns} alignRight={alignRight} />

<Resources links={resourceLinks} />
