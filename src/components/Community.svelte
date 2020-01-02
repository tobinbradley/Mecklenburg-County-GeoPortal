<script>
  import { location } from '../store.js'
  import Title from './Title.svelte'
  import Resources from './Resources.svelte'
  import jsonToURL from '../js/jsonToURL.js'

  let selected
  let npa
  let iframe

  // QoL Metrics
  const metrics = [
    {
      "id": "34",
      "title": "Bicycle Friendliness"
    },
    {
      "id": "54",
      "title": "Births to Adolescents"
    },
    {
      "id": "10",
      "title": "Commuters Driving Alone"
    },
    {
      "id": "59",
      "title": "Crime - Property"
    },
    {
      "id": "58",
      "title": "Crime - Violent"
    },
    {
      "id": "20",
      "title": "Education Level - Bachelor's Degree"
    },
    {
      "id": "26",
      "title": "Energy Consumption - Electricity"
    },
    {
      "id": "80",
      "title": "Food and Nutrition Services"
    },
    {
      "id": "65",
      "title": "High School Graduation Rate"
    },
    {
      "id": "76",
      "title": "Home Sales Price"
    },
    {
      "id": "37",
      "title": "Household Income"
    },
    {
      "id": "33",
      "title": "Long Commute"
    },
    {
      "id": "13",
      "title": "Population - Older Adult"
    },
    {
      "id": "12",
      "title": "Population - Youth"
    },
    {
      "id": "47",
      "title": "Population Density"
    },
    {
      "id": "36",
      "title": "Proximity to Public Transportation"
    },
    {
      "id": "45",
      "title": "Proximity to a Grocery Store"
    },
    {
      "id": "81",
      "title": "Public Health Insurance"
    },
    {
      "id": "15",
      "title": "Race/Ethnicity - Black or African American"
    },
    {
      "id": "18",
      "title": "Race/Ethnicity - Hispanic or Latino"
    },
    {
      "id": "14",
      "title": "Race/Ethnicity - White or Caucasian"
    },
    {
      "id": "40",
      "title": "Rental Costs"
    },
    {
      "id": "64",
      "title": "Test Proficiency - High School"
    },
    {
      "id": "3",
      "title": "Tree Canopy"
    },
    {
      "id": "48",
      "title": "Voter Participation"
    },
    {
      "id": "27",
      "title": "Water Consumption"
    }
  ]

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


  location.subscribe(value => {
		fetchData()
  })

  $: setURL(npa, selected)

  function setURL() {
    if (selected && npa) {
      iframe.src = `https://mcmap.org/qol-dev/embed.html?rl=${Math.floor((Math.random()*1000000)+1)}#${selected}/npa.geojson.json:${npa}`
    }
  }

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
        npa = data[0].id
      })
      .catch(ex => {
        console.log("parsing failed", ex);
      })
  }

</script>

<style>
  .qol-iframe {
    @apply border-none w-full;
    height: 400px;
    max-width: 7.5in;
    page-break-inside: avoid;
    page-break-before : always;
  }

  @screen md {
    .qol-iframe {
      height: 820px;
    }
  }

  @media print {
    .qol-iframe {
      height: 820px;
    }
  }

</style>

<Title title="Community" icon="community" />

<div class="flex flex-row flex-wrap justify-around print:hidden">
  <div class="flex flex-row flex-wrap justify-around" style="width: 450px">
    <label class="block text-2xl font-bold mb-2" for="metricselect">
      Choose a Metric
    </label>
    <div class="relative w-full">
      <select bind:value={selected} class="block appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight w-full focus:outline-none focus:bg-white focus:border-gray-500" id="metricselect">
        {#each metrics as {id, title}}
          <option value={id}>{title}</option>
        {/each}
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>
</div>


<div class="flex justify-around my-10">
  <iframe bind:this={iframe} title="Quality of Life Dashboard" class="qol-iframe" scrolling="no"></iframe>
</div>



<Resources links={resourceLinks} />
