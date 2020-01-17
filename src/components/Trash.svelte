<script>
  import { location } from '../store.js'
  import Title from './Title.svelte'
  import Resources from './Resources.svelte'
  import Table from './Table.svelte'
  import RecordHighlight from './RecordHighlight.svelte'
  import jsonToURL from '../js/jsonToURL.js'
  import { formatCommas } from '../js/formatNumbers.js'

  // Base table
  const columns = ["Collection Service", "Day"]
  const alignRight = []
  let rows = []

  // Map
  let showMap = false
  const toggleLayers = 'impervious'

  // Resources
  const resourceLinks = [
    {
      name: 'Charlotte Solid Waste Services',
      url: 'http://charmeck.org/city/charlotte/SWS'
    },
    {
      name: 'Cornelius Solid Waste Services',
      url: 'http://www.cornelius.org/index.aspx?nid=208'
    },
    {
      name: 'Huntersville Solid Waste and Recycling Collection',
      url: 'http://www.huntersville.org/Departments/EngineeringPublicWorks/SolidWasteRecycling.aspx'
    },
    {
      name: 'Town of Pineville',
      url: 'http://www.pinevillenc.gov/'
    },
    {
      name: 'Town of Matthews',
      url: 'http://www.matthewsnc.gov/'
    }
  ]

  // trash collection variables
  let collectionData = null

  location.subscribe(value => {
		fetchData($location.lnglat[0], $location.lnglat[1])
	})

  function fetchData(lng, lat) {
    // reset variables
    rows = []

    const params = {
      geom_column: "the_geom",
      columns: "jurisdiction, day, week, type"
    }

    fetch(`https://mcmap.org/api2/v1/intersect_point/solid_waste/${lng},${lat},4326?${jsonToURL(params)}`)
      .then(response => response.json())
      .then(data => {
        // make records for table
        data.forEach(el => {
          rows.push([
            el.type,
            el.day
          ])
        })
        collectionData = data
      })
      .then(() => {
        rows = rows
      })
      .catch(ex => {
        console.log("parsing failed", ex);
      })
  }

  function recyclingWeek(w) {
    if (!w) return ''
    var theDate = new Date();
    if (typeof w == "object") {
      w = w.filter(rec => rec.type === "RECYCLING" || rec.type === "Garbage and Recycling")[0].week
    }
    theDate.setHours(0, 0, 0, 0);
    var currentWeek = checkOddEven(weekNumber(theDate.getTime()));
    var propertyWeek = weekEvenOdd(w);
    if (currentWeek === propertyWeek) {
      return "this week";
    } else {
      return "next week";
    }
  }

  function weekEvenOdd(w) {
    if (w === "A" || w === "GREEN") {
      return "even";
    } else {
      return "odd";
    }
  }

  function weekNumber(d) {
    // the length of a week
    var one_week = 1000 * 60 * 60 * 24 * 7;
    // the start of a Green or A week
    var a = new Date("2015-08-30").getTime();
    var weekN = Math.floor((d - a) / one_week);
    return weekN;
  }

  function checkOddEven(num) {
    if (num % 2 === 0) {
      return "even";
    } else {
      return "odd";
    }
  }

  function getDay(data, filter) {
    if (!data) return ''
    const day = data.filter(el => filter.indexOf(el.type.toUpperCase()) !== -1)
    return day[0].day.toUpperCase()
  }

  function getColor(data) {
    if (data) {
      const color = data.filter(el => ['RECYCLING', 'GARBAGE AND RECYCLING'].indexOf(el.type.toUpperCase()) !== -1)
      if (color[0].jurisdiction === 'charlotte') {
        return ` (${color[0].week})`
      }
    }
    return ''
  }

</script>

<Title title="TRASH &amp; RECYCLING" icon="trash" />

{#if collectionData && collectionData.length > 0}
<div class="flex flex-row flex-wrap justify-around print:block">
  <RecordHighlight top="Your TRASH collection day is" headline={getDay(collectionData, ['GARBAGE', 'GARBAGE AND RECYCLING'])} />
  <RecordHighlight top="Your RECYCLING collection day is" sub={`Recycling pickup is every other week${getColor(collectionData)}.`}
    headline={getDay(collectionData, ['RECYCLING', 'GARBAGE AND RECYCLING']) + ' ' + recyclingWeek(collectionData)} />
</div>
<Table caption="All Collection Services" rows={rows} columns={columns} alignRight={alignRight} />
{/if}

{#if collectionData && collectionData.length === 0}
<p class="p-8">
Unfortunately we only know collection information for Huntersville, Cornelius, Matthews, Pineville, Davidson, Mint Hill and Charlotte.
For collection information for you location, please visit you local government web site.
</p>
{/if}

<Resources links={resourceLinks} />
