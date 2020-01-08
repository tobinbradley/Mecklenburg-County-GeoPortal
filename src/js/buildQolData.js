// Doesn't run in app. I'm using this to extract the quality of life data
// in public/data from our quality of life app
// needs csvtojson installed
const fs = require('fs')
const csv = require('csvtojson')
const config = require('./data')
const charlotte = require('./groups/npa-jurisdiction-charlotte.json')

const metrics = [34, 54, 10, 59, 58, 20, 26, 80, 65, 76, 37, 33, 13, 12, 47, 36, 45, 81, 15, 18, 14, 40, 64, 3, 48, 27].map(String)
let mOutput = {}
let gOutput = {"charlotte": {}, "mecklenburg": {}}


// return true if convertable to number
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

// format number output
function formatNumber(m, n) {
  n = n.toFixed(m.decimals || 0)
  n = n.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return (m.prefix || '') + n + (m.suffix || '')
}

// get NPA values
const goNPA = async () => {
  for (const m of metrics) {
    mOutput[m] = {}
    const rJSON = await csv().fromFile('metric/r' + m + '.csv')
    const dJSON = await csv().fromFile('metric/d' + m + '.csv')
    const keys = Object.keys(rJSON[0])

    rJSON.forEach((el, idx) => {
      const rVal = el[keys[keys.length - 1]]
      const d = dJSON.filter(d => d.id === el.id)
      const dVal = d[0][keys[keys.length - 1]]

      if (isNumeric(rVal) && isNumeric(dVal)) {
        mOutput[m][el[keys[0]]] = formatNumber(config.filter(c => c.metric === m)[0] ,rVal / dVal)
      }
    })
  }
}

// get charlotte and mecklenburg values
const goGroup = async () => {
  for (const m of metrics) {
    const rJSON = await csv().fromFile('metric/r' + m + '.csv')
    const dJSON = await csv().fromFile('metric/d' + m + '.csv')
    const keys = Object.keys(rJSON[0])

    gOutput.mecklenburg[m] = formatNumber(
      config.filter(c => c.metric === m)[0],
      rJSON
        .map(el => Number(el[keys[keys.length - 1]]))
        .reduce((a, b) => a + b, 0) /
        dJSON
          .map(el => Number(el[keys[keys.length - 1]]))
          .reduce((a, b) => a + b, 0)
    )

    gOutput.charlotte[m] = formatNumber(
      config.filter(c => c.metric === m)[0],
      rJSON
        .filter(el => charlotte.indexOf(el.id) !== -1)
        .map(el => Number(el[keys[keys.length - 1]]))
        .reduce((a, b) => a + b) /
        dJSON
          .filter(el => charlotte.indexOf(el.id) !== -1)
          .map(el => Number(el[keys[keys.length - 1]]))
          .reduce((a, b) => a + b)
    )
  }
}

// write config file
let gpConfig = []
let gpMetricConfig = config.filter(c => metrics.indexOf(c.metric) !== -1)
gpMetricConfig.forEach(m => {
  let cfg = {
    metric: m.metric,
    title: m.title
  }
  if (m.label) cfg.label = m.label
  gpConfig.push(cfg)
})
const gpSort = gpConfig.sort((a, b) => a.title > b.title ? 1 : -1)
fs.writeFileSync('community-config.json', JSON.stringify(gpSort, null, '  '))

goGroup().then(() => {
  fs.writeFileSync('community-group.json', JSON.stringify(gOutput, null, ''))
})

goNPA().then(() => {
  fs.writeFileSync('community-npa.json', JSON.stringify(mOutput, null, ''))
})
