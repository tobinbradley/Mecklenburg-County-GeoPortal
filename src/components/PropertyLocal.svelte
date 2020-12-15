<script>
  import { location } from '../store.js'
  import Title from './Title.svelte'
  import Resources from './Resources.svelte'
  import Table from './Table.svelte'
  import Map from './Map.svelte'
  import RecordHighlight from './RecordHighlight.svelte'
  import jsonToURL from '../js/jsonToURL.js'
  import { formatCommas, formatMoney, formatDate } from '../js/formatNumbers.js'
  import toastMaker from '../js/toastMaker'

  // let them know things are not great
  toastMaker('warning', "We're currently experiencing some technical difficulties. Property information may be incomplete or slightly dated.", 3000, 6000)

  // Tables
  const ownerTable = {
    caption: "Ownership",
    columns: ["Owner", "Address"],
    rows: []
  }
  const appraisalTable = {
    caption: "Tax Appraisal",
    columns: ["Land", "Extra", "Total"],
    alignRight: [1,2,3],
    rows: []
  }
  const saleTable = {
    caption: "Sale History",
    columns: ["Date", "Deed Book", "Legal Reference", "Price"],
    alignRight: [2, 3, 4],
    rows: []
  }
  const useTable = {
    caption: "Land Use",
    columns: ["Use", "Neighborhood"],
    alignRight: [],
    rows: []
  }
  const buildingTable = {
    caption: "Buildings",
    columns: ["Structure", "Year Built", "Exterior", "Area", "Beds", "Baths"],
    alignRight: [4,5,6],
    rows: []
  }
  const permitTable = {
    caption: "Building Permits",
    columns: ["Date", "Project", "Area", "Cost"],
    alignRight: [3,4],
    rows: []
  }

  // other variables
  let zoning = null
  let photo= null

  // Map
  let showMap = false

  // Resources
  const resourceLinks = [
    {
      name: 'POLARIS',
      url: 'http://polaris.mecklenburgcountync.gov/'
    },
    {
      name: "County Assessor's Office",
      url: 'https://www.mecknc.gov/assessorsoffice/Pages/Home.aspx'
    },
    {
      name: 'Office of the Tax Collector',
      url: 'https://www.mecknc.gov/taxcollections/Pages/Home.aspx'
    },
    {
      name: 'Charlotte Planning',
      url: 'https://charlottenc.gov/planning/Pages/Home.aspx'
    },
    {
      name: 'Tax data on Open Mapping',
      url: 'http://maps.co.mecklenburg.nc.us/openmapping/data.html?search=tax'
    }
  ]

  location.subscribe(value => {
		fetchData()
	})

  function fetchData() {
    // reset variables
    zoning = null;
    photo = null;
    [ownerTable, appraisalTable, saleTable, useTable, buildingTable, permitTable].forEach(item => {
      item.rows = []
    })


    // house photo
    fetch(`https://mcmap.org/api2/v1/query/property_photos?${jsonToURL({
      columns: 'image_path,image_date',
      filter: `taxpid = '${$location.pid}'`,
      sort: 'image_date desc'
    })}`)
      .then(response => response.json())
      .then(data => {
        data.length > 0 ?
        photo = `<a href=${data[0].image_path} class="block mt-2" target="_blank">
            <img src=${data[0].image_path} class="max-w-full shadow-xl rounded-lg" alt="property photo">
          </a>`
        : photo = null
      })
      .catch(ex => {
        console.log("parsing failed", ex);
      })

    // zoning
    fetch(`https://mcmap.org/api2/v1/intersect_point/view_zoning/${$location.lnglat.join(',')},4326?${jsonToURL({
      columns: 'zone_des,zone_class',
      geom_column: "the_geom"
    })}`)
      .then(response => response.json())
      .then(data => {
        data.length > 0 ?
          zoning = `Zoned as <span class="font-bold">${data[0].zone_class} ${data[0].zone_des}</span>` : zoning = null
      })
      .catch(ex => {
        console.log("parsing failed", ex);
      })

    // ownership
    fetch(`https://mcmap.org/api2/v1/query/parcel_taxdata?${jsonToURL({
      columns: "coalesce(ownerlastn, '') as nme_ownerlastname,coalesce(ownerfirst, '') as nme_ownerfirstname,mailaddr1 as txt_mailaddr1,coalesce(mailaddr2, '') as txt_mailaddr2,city as txt_city,state as txt_state,zipcode as txt_zipcode",
      filter: `pid = '${$location.pid}'`
    })}`)
      .then(response => response.json())
      .then(data => {
        data.forEach(el => {
          ownerTable.rows.push([
            `${el.nme_ownerfirstname} ${el.nme_ownerlastname}`,
            `${el.txt_mailaddr1} ${el.txt_mailaddr2}<br>${el.txt_city}, ${el.txt_state} ${el.txt_zipcode}`
          ])
        })
      })
      .then(() => {
        ownerTable.rows = ownerTable.rows
      })
      .catch(ex => {
        toastMaker( "error", "We're having a problem loading this data. Please try back later.")
        console.log("parsing failed", ex);
      })

    // appraisal
    fetch(`https://mcmap.org/api2/v1/query/parcel_taxdata?${jsonToURL({
      columns: 'extravalue as amt_extrafeaturevalue,landvalue as amt_landvalue,totalvalue as amt_totalvalue',
      filter: `pid = '${$location.pid}'`
    })}`)
      .then(response => response.json())
      .then(data => {
        data.forEach(el => {
          appraisalTable.rows.push([
            formatMoney(el.amt_landvalue),
            formatMoney(el.amt_extrafeaturevalue),
            formatMoney(el.amt_totalvalue)
          ])
        })
      })
      .then(() => {
        appraisalTable.rows = appraisalTable.rows
      })
      .catch(ex => {
        toastMaker( "error", "We're having a problem loading this data. Please try back later.")
        console.log("parsing failed", ex);
      })

    // sale history
    fetch(`https://mcmap.org/api2/v1/query/parcel_taxdata?${jsonToURL({
      columns: 'dateofsale as dte_dateofsale,price as amt_price,deedbook as txt_deedbook,deedpage as txt_deedpage,legalrefer as txt_legalreference',
      filter: `pid = '${$location.pid}'`
    })}`)
      .then(response => response.json())
      .then(data => {
        data.forEach(el => {
          saleTable.rows.push([
            formatDate(el.dte_dateofsale),
            `${el.txt_deedbook} ${el.txt_deedpage}`,
            el.txt_legalreference,
            formatMoney(el.amt_price),
          ])
        })
      })
      .then(() => {
        saleTable.rows = saleTable.rows
      })
      .catch(ex => {
        toastMaker( "error", "We're having a problem loading this data. Please try back later.")
        console.log("parsing failed", ex);
      })

    // land use
    fetch(`https://mcmap.org/api2/v1/query/parcel_taxdata?${jsonToURL({
      columns: 'descproper as txt_landuse_fulldesc,neighbourh as txt_neigh_desc',
      filter: `pid = '${$location.pid}'`
    })}`)
      .then(response => response.json())
      .then(data => {
        data.forEach(el => {
          useTable.rows.push([
            el.txt_landuse_fulldesc,
            el.txt_neigh_desc || ''
          ])
        })
      })
      .then(() => {
        useTable.rows = useTable.rows
      })
      .catch(ex => {
        toastMaker( "error", "We're having a problem loading this data. Please try back later.")
        console.log("parsing failed", ex);
      })

    // buildings
    fetch(`https://mcmap.org/api2/v1/query/parcel_taxdata?${jsonToURL({
      columns: 'descbuildi as txt_propertyuse_desc,yearbuilt as num_yearbuilt,extwall as txt_extwall_desc,heatedarea as num_grossarea,bedrooms as num_bedrooms,fullbaths as cnt_fullbaths,halfbaths as cnt_halfbaths',
      filter: `pid = '${$location.pid}'`
    })}`)
      .then(response => response.json())
      .then(data => {
        data.forEach(el => {
          buildingTable.rows.push([
            el.txt_propertyuse_desc,
            el.num_yearbuilt,
            el.txt_extwall_desc,
            formatCommas(el.num_grossarea) + ' Sq. Ft.',
            el.num_bedrooms,
            el.cnt_fullbaths + el.cnt_halfbaths
          ])
        })
      })
      .then(() => {
        buildingTable.rows = buildingTable.rows
      })
      .catch(ex => {
        toastMaker( "error", "We're having a problem loading this data. Please try back later.")
        console.log("parsing failed", ex);
      })

    // building permits
    fetch(`https://mcmap.org/api2/v1/intersect_feature/tax_parcels/building_permits?${jsonToURL({
      columns: 'date_completed_co_process,project_name,square_footage,construction_cost',
      filter: `tax_parcels.pid = '${$location.pid}'`,
      geom_column_from: "the_geom",
      geom_column_to: "the_geom"
    })}`)
      .then(response => response.json())
      .then(data => {
        data.forEach(el => {
          permitTable.rows.push([
            formatDate(el.date_completed_co_process),
            el.project_name,
            formatCommas(el.square_footage) + ' Sq. Ft.',
            formatMoney(el.construction_cost)
          ])
        })
      })
      .then(() => {
        permitTable.rows = permitTable.rows
      })
      .catch(ex => {
        toastMaker( "error", "We're having a problem loading this data. Please try back later.")
        console.log("parsing failed", ex);
      })

  }

</script>

<Title title="PROPERTY" icon="property" />

<Map showMap={showMap} />

<div class="flex flex-row flex-wrap justify-around">
  <RecordHighlight top="Parcel ID" sub={zoning} headline={$location.pid} detail={photo} />
</div>

<Table {...ownerTable} />
<Table {...appraisalTable} />
<Table {...saleTable} />
<Table {...useTable} />
<Table {...buildingTable} />
<Table {...permitTable} />

<Resources links={resourceLinks} />
