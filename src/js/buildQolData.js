// Doesn't run in app. I'm using this to extract the quality of life data
// in public/data from our quality of life app
// needs csvtojson installed
const fs = require('fs')
const csv = require('csvtojson')
const config = require('./data')
const charlotte = require('./groups/npa-jurisdiction-charlotte.json')
const { CLIENT_RENEG_LIMIT } = require('tls')


// List of metrics to make yo
const metrics = [34, 54, 10, 59, 58, 20, 26, 80, 65, 76, 37, 33, 13, 12, 47, 36, 45, 81, 15, 18, 14, 40, 64, 3, 48, 27].map(String)




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
  let mOutput = {}

  for (const m of metrics) {
    mOutput[m] = {}
    const rJSON = await csv().fromFile('metric/r' + m + '.csv')
    const dJSON = await csv().fromFile('metric/d' + m + '.csv')
    const keys = Object.keys(rJSON[0])

    rJSON.forEach((el, idx) => {
      const id = el[keys[0]]
      let vals = []

      for (let idx = 1; idx < keys.length; idx++) {
        y = keys[idx]
        const rVal = el[y]
        const d = dJSON.filter(d => d.id === el.id)
        const dVal = d[0][y]

        if (isNumeric(rVal) && isNumeric(dVal)) {
          vals.push(formatNumber(config.filter(c => c.metric === m)[0], rVal / dVal))
        } else {
          vals.push(null)
        }

      }
      mOutput[m][el["id"]] = vals
    })
  }

  return mOutput
}

// get charlotte and mecklenburg values
const goGroup = async () => {
  let gOutput = {"charlotte": {}, "mecklenburg": {}}

  for (const m of metrics) {
    const rJSON = await csv().fromFile('metric/r' + m + '.csv')
    const dJSON = await csv().fromFile('metric/d' + m + '.csv')
    const keys = Object.keys(rJSON[0])

    gOutput.mecklenburg[m] = []

    for (let i = 1; i < keys.length; i++) {
      const key = keys[i]
      gOutput.mecklenburg[m].push(
        formatNumber(
          config.filter(c => c.metric === m)[0],
          rJSON
            .map(el => Number(el[key]))
            .reduce((a, b) => a + b, 0) /
            dJSON
              .map(el => Number(el[key]))
              .reduce((a, b) => a + b, 0)
        )
      )
    }


    gOutput.charlotte[m] = []

    for (let i = 1; i < keys.length; i++) {
      const key = keys[i]
      gOutput.charlotte[m].push(
        formatNumber(
          config.filter(c => c.metric === m)[0],
          rJSON
            .filter(el => charlotte.indexOf(el.id) !== -1)
            .map(el => Number(el[key]))
            .reduce((a, b) => a + b) /
            dJSON
              .filter(el => charlotte.indexOf(el.id) !== -1)
              .map(el => Number(el[key]))
              .reduce((a, b) => a + b)
        )
      )
    }

  }

  return gOutput
}

// write config file
const goConfig = async () => {
  let gpConfig = []
  let gpMetricConfig = config.filter(c => metrics.indexOf(c.metric) !== -1)

  for (let idx = 0; idx < gpMetricConfig.length; idx++) {
    const m = gpMetricConfig[idx]
    const rJSON = await csv().fromFile('metric/r' + m.metric + '.csv')
    const keys = Object.keys(rJSON[0])
    keys.shift()
    let cfg = {
      metric: m.metric,
      title: m.title,
      years: keys.map(y => y.replace('y_', ''))
    }
    if (m.label) cfg.label = m.label
    gpConfig.push(cfg)
  }

  return  gpConfig.sort((a, b) => a.title > b.title ? 1 : -1)
}


goConfig().then((data) => {
  fs.writeFileSync('community-config.json', JSON.stringify(data, null, '  '))
})

goGroup().then((data) => {
  fs.writeFileSync('community-group.json', JSON.stringify(data, null, ''))
})

goNPA().then((data) => {
  fs.writeFileSync('community-npa.json', JSON.stringify(data, null, ''))
})
