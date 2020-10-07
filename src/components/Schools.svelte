<script>
  import { location } from '../store.js'
  import Title from './Title.svelte'
  import Resources from './Resources.svelte'
  import Table from './Table.svelte'
  import Map from './Map.svelte'
  import jsonToURL from '../js/jsonToURL.js'
  import { formatCommas } from '../js/formatNumbers.js'

  // Figure out what to label the school years
  const d = new Date()
  const y = d.getFullYear()
  const yFactor = d.getMonth() + 1 <= 7 ? -1 : 0

  // Magnet table
  const magnetTable = {
    columns: ["School", "Focus", "Grades", "Address", "Distance"],
    alignRight: [5],
    rows: []
  }

  // Current schools table
  const schoolsCurrent = {
    columns: ["School", "Grades", "Address", "Distance"],
    alignRight: [4],
    rows: []
  }

  // Future schools table
  const schoolsFuture = JSON.parse(JSON.stringify(schoolsCurrent))

  // Magnet Zone
  let zone = ''

  // Map
  let showMap = false
  let mapPoints = []
  let focusPoint = null

  // Resources
  const resourceLinks = [
    {
      name: 'Charlotte-Mecklenburg Schools',
      url: 'http://www.cms.k12.nc.us/'
    },
    {
      name: 'School data on Open Mapping',
      url: 'http://maps.co.mecklenburg.nc.us/openmapping/data.html?search=school'
    }
  ]

  location.subscribe(value => {
		fetchData()
	})

  function fetchData() {
    // reset catchers
    [magnetTable, schoolsCurrent, schoolsFuture].forEach(item => {
      item.rows = []
    })
    zone = ''
    mapPoints = []

    fetchMagnet($location.lnglat[0], $location.lnglat[1])
    fetchSchools($location.lnglat[0], $location.lnglat[1])
  }

  function fetchSchools(lng, lat) {
    const urls = [
      `https://mcmap.org/api2/v1/nearest/cms_parcels/${lng},${lat},4326?columns=high_zone,gradek,grade1,grade2,grade3,grade4,grade5,grade6,grade7,grade8,grade9,grade10,grade11,grade12&limit=1`,
      `https://mcmap.org/api2/v1/nearest/cms_parcels_future_py/${lng},${lat},4326?columns=high_zone,gradek,grade1,grade2,grade3,grade4,grade5,grade6,grade7,grade8,grade9,grade10,grade11,grade12&limit=1`
    ]

    Promise.all(urls.map(url =>
      fetch(url).then(resp => resp.json())
    )).then(jsons => {

      // set transportation zone
      zone = jsons[0][0]["high_zone"];

      jsons.forEach(elem => {
        delete elem[0].distance
        delete elem[0].high_zone
      })

      // school numbers to fetch
      const schlnums = [...new Set(Object.values(jsons[0][0]).concat(Object.values(jsons[1][0])))]

      fetch(`https://mcmap.org/api2/v1/query/cms_schools?columns=city,num as schlnum,address,name,type,ST_Distance(geom,ST_Transform(GeomFromText('POINT( ${lng} ${lat} )',4326), 2264)) as distance,st_x(st_transform(geom, 4326)) as lng, st_y(st_transform(geom, 4326)) as lat&filter=num in(${schlnums.join()})`)
        .then(schools => schools.json())
        .then(schools => {

          schools.forEach(school => {
            mapPoints.push({
              label: school.type.charAt(0),
              lngLat: [school.lng, school.lat],
              name: school.name,
              address: `${school.address}, ${school.city}`
            })
          })

          jsons.forEach((elem, idx) => {
            let results = []
            let schls = [...new Set(Object.values(elem[0]))]

            schls.forEach(scl => {
              let grades = []

              Object.keys(elem[0]).forEach(key => {
                if (elem[0][key] === scl) grades.push(key.replace("grade", '').toUpperCase())
              })

              let result = JSON.parse(JSON.stringify(schools.filter(el => el.schlnum === scl)[0]))
              result.grades = grades

              results.push([
                result.name,
                result.grades.join(', '),
                result.address,
                `${formatCommas(result.distance / 5280, 1)} miles`
              ])
            })

            idx === 0 ? schoolsCurrent.rows = results : schoolsFuture.rows = results
          })

        })

    })
  }

  function fetchMagnet(lng, lat) {
    const params = {
      filter: "magnet in ('Full', 'Partial')",
      columns: `num,city,address,name,grade_level,mag_focus,st_x(st_transform(geom, 4326)) as lng,
          st_y(st_transform(geom, 4326)) as lat,magnet,
          ST_Distance(geom,ST_Transform(
          GeomFromText('POINT( ${lng} ${lat} )',4326), 2264)) as distance`,
      sort: 'distance'
    }

    fetch(`https://mcmap.org/api2/v1/query/cms_schools?${jsonToURL(params)}`)
      .then(response => response.json())
      .then(data => {
        // make records for table
        data.forEach(el => {
          magnetTable.rows.push([
            el.name,
            el.mag_focus,
            el.grade_level,
            `${el.address}, ${el.city}`,
            `${formatCommas(el.distance / 5280, 1)} miles`
//                [4429, 8364, 5532, 8482, 7405, 7496, 5520].indexOf(Number(el.num)) !== -1 ? 'All' : '',
          ])
        })
      })
      .then(() => {
        magnetTable.rows = magnetTable.rows
        mapPoints = mapPoints
      })
      .catch(ex => {
        console.log("parsing failed", ex);
      })
  }

</script>


<Title title="SCHOOLS" icon="school" />

<Map showMap={showMap} mapPoints={mapPoints} focusPoint={focusPoint} />

<Table rows={schoolsCurrent.rows} columns={schoolsCurrent.columns} caption="Currnet School Year" alignRight={schoolsCurrent.alignRight} />

<!-- <Table rows={schoolsFuture.rows} columns={schoolsFuture.columns} caption={`${y + yFactor + 1}-${y + yFactor + 2} School Year`} alignRight={schoolsFuture.alignRight} /> -->

<Table rows={magnetTable.rows} columns={magnetTable.columns} caption={'Magnet Schools (You Are in <a href="https://cmschoice.org/your-choices/transportation-zones/" target="_blank">Zone ' + zone + '</a>)'} alignRight={magnetTable.alignRight} />

<p class="pt-8 pb-2">
  Transportation eligibility is determined by the transportation zone in which you live.
  The county is divided into three transportation zones:
  violet, blue and green.
  Magnet schools are assigned a zone to serve with transportation. Some programs
  provide county-wide transportation, meaning that regardless of your zone,
  you would receive transportation. For more information please contact
  Charlotte-Mecklenburg School Transportation Services at <a href="tel:9803436715">(980) 343-6715</a>.
</p>

<p class="pt-2 pb-8">
  School assignment information is based on data provided by Charlotte-Mecklenburg Schools and Mecklenburg
  County GIS. For questions, concerns, or confirmation of schools assignments, please contact Charlotte-Mecklenburg Schools at <a href="email:planning@cms.k12.nc.us">planning@cms.k12.nc.us</a> or <a href="tel:9803436246">(980) 343-6246</a>.
</p>

<Resources links={resourceLinks} />
