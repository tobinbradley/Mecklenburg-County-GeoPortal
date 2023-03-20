<script>
  import { location } from '../store.js'
  import Title from './Title.svelte'
  import Resources from './Resources.svelte'
  import Map from './MapCommunity.svelte'
  import jsonToURL from '../js/jsonToURL.js'
  import Sparkline from './Sparkline.svelte'
  import {formatNumber, isNumeric} from '../js/formatNumbers'
  import metricConfig from '../data/data.json'
  import metricGroup from '../data/neighborhod-groups.json'

  const metricList = ["m34", "m54", "m10", "m59", "m58", "m20", "m26", "m80", "m65", "m88", "m76", "m37", "m33", "m13", "m12", "m47", "m36", "m45", "m81", "m15", "m18", "m14", "m40", "m64", "m3", "m48", "m27"]
  const defaultMetric = "m37"
  let npa
  let selected = metricGroup.Jurisdiction.Charlotte


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

  const columns = ["metric", "neighborhood", "charlotte", "mecklenburg"]
  let highlightRow = 10

  // map stuff
  let showMap = false
  let mapMeta = {}
  let mapData = null

  location.subscribe(value => {
		fetchData()
  })

  function fetchData() {
    fetch(`https://api.mcmap.org/v1/nearest/neighborhoods/${$location.lnglat.join(',')},4326?${jsonToURL({
      columns: 'id',
      geom_column: 'the_geom',
      limit: 1
    })}`)
      .then(response => response.json())
      .then(data => {
        npa = data[0].id.toString()
      })
      .catch(ex => {
        console.log("parsing failed", ex);
      })
  }

  // map map data
  function setMap(data, meta) {
    mapData = data
    mapMeta = meta
  }

  async function fetchQolData(m) {
    const res = await fetch(`https://mcmap.org/qol/data/metric/${m}.json`);
		const json = await res.json();

		if (res.ok) {
      if (m == defaultMetric) setMap(json, metricConfig.filter(el => el.metric === defaultMetric)[0])
			return json
		} else {
			throw new Error(json);
		}
  }

  function sumGroup(data, yearId, grp = null) {
    let n = []
    let d = []

    Object.keys(data.m).forEach(k => {
      if ((!grp || grp.includes(k) ) && isNumeric(data.m[k][yearId]) && isNumeric(data.d[k][yearId])) {
        n.push(data.m[k][yearId] * data.d[k][yearId])
        d.push(data.d[k][yearId])
      }
    })

    if (n.length > 0) {
      return n.reduce((x, y) => { return x + y}) / d.reduce((x, y) => { return x + y})
    }
    return '--'
  }

  function sparklineData(data, metric, grp = null) {
    const sparklineData = []
    data.years.forEach((year, idx) => {
      const d = sumGroup(data, idx, grp)
      if (isNumeric(d)) {
        sparklineData.push({
          year: year,
          label: `${year}: ${formatNumber(d,
            metricConfig.filter(el => el.metric === metric)[0].format || null,
            metricConfig.filter(el => el.metric === metric)[0].decimals || 0)}`,
          value: d
        })
      }
    })

    // fill any missing values
    if (sparklineData.length > 1) {
      for (let i = 0; i < data.years.length - 1; i++) {
        if (sparklineData.filter(el => el.year == data.years[i]).length === 0) {
          sparklineData.push({
            year: data.years[i],
            label: null,
            value: null
          })
        }
      }
    }

    sparklineData.sort((a, b) => {
      return a.year - b.year;
    })

    return sparklineData
  }


  function handleMapLink(data, meta) {
    showMap = true
    setMap(data, meta)

    document
      .querySelector('#Community-scrollTarget')
      .scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
  }

</script>

<Title title="Community" icon="community" />

<Map showMap={showMap} mapMeta={mapMeta} mapData={mapData} />

<div class="w-full pt-10 pb-5">
  <table class="table-component table-auto w-full">
  <thead>
    <tr>
      <th></th>
      <th class="text-left">METRIC</th>
      <th class="text-center">NEIGHBORHOOD</th>
      <th class="text-center">
        <select bind:value={selected} class="bg-white uppercase outline-0 border-b-2 border-slate-800 dark:border-white dark:bg-slate-800">
          {#each Object.keys(metricGroup) as category}
          <optgroup label={category}>
            {#each Object.keys(metricGroup[category]) as group}
              <option value={metricGroup[category][group]}>{category === 'Jurisdiction' ? '' : category} {group}</option>
            {/each}
          </optgroup>
          {/each}
        </select>
      </th>
      <th class="text-center">MECKLENBURG</th>
    </tr>
  </thead>
  {#if npa}
  <tbody>
    {#each metricList as metric}
      <tr>
        {#await fetchQolData(metric)}
          ...waiting
        {:then data}
          <td class="cursor-pointer"
            on:click={() => {handleMapLink(data, metricConfig.filter(el => el.metric === metric)[0])}}
            on:keypress={() => {handleMapLink(data, metricConfig.filter(el => el.metric === metric)[0])}}
            >
            <svg class="w-5 h-5 block m-auto fill-current">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-map2"></use>
            </svg>
          </td>
          <td data-label="METRIC">
            {metricConfig.filter(el => el.metric === metric)[0].title},
            {data.years[data.years.length - 1]}
            {#if metricConfig.filter(el => el.metric === metric)[0].label}
            <span class="block text-sm">{@html metricConfig.filter(el => el.metric === metric)[0].label}</span>
            {/if}
          </td>
          <td data-label="NEIGHBORHOOD" class="text-center">
            {formatNumber(
              data.m[npa][data.years.length - 1],
              metricConfig.filter(el => el.metric === metric)[0].format || null,
              metricConfig.filter(el => el.metric === metric)[0].decimals || 0)
            }
            <br>
            <Sparkline data={sparklineData(data, metric, [npa])} />
          </td>
          <td data-label="" class="text-center">
            {formatNumber(
              sumGroup(data, data.years.length - 1, selected),
              metricConfig.filter(el => el.metric === metric)[0].format || null,
              metricConfig.filter(el => el.metric === metric)[0].decimals || 0
            )}
            <br>
            <Sparkline data={sparklineData(data, metric, selected)} />
          </td>
          <td data-label="MECKLENBURG" class="text-center">{formatNumber(
            sumGroup(data, data.years.length - 1),
            metricConfig.filter(el => el.metric === metric)[0].format || null,
            metricConfig.filter(el => el.metric === metric)[0].decimals || 0
          )}
          <br>
          <Sparkline data={sparklineData(data, metric)} />
          </td>
        {:catch error}
          <td>
          ...problem fetching data
          </td>
        {/await}
      </tr>
    {/each}

  </tbody>
  {/if}
</table>
</div>

<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="0" height="0">
  <symbol id="icon-map2" viewBox="0 0 32 32">
    <path d="M21 6l-10-4-11 4v24l11-4 10 4 11-4v-24l-11 4zM12 4.554l8 3.2v19.692l-8-3.2v-19.692zM2 7.401l8-2.909v19.744l-8 2.909v-19.744zM30 24.599l-8 2.909v-19.744l8-2.909v19.744z"></path>
    </symbol>
</svg>

<!-- <Table caption="Your Neighborhood" rows={rows} columns={columns} alignCenter={[2, 3, 4]} mapLinks={mapLinks} on:mapLink={handleMapLink} sparklines={sparklines} highlightRow={highlightRow} /> -->

<Resources links={resourceLinks} />
