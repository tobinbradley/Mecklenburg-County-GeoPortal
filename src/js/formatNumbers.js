function formatCommas(num, decimals = 0) {
  if (num === null) return '0'
  return num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function formatMoney(num, decimals = 0) {
  if (num === null) return '$0'
  return '$' + num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function formatDate(dateString) {
  let date = new Date(dateString)
  //date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}

export {formatCommas, formatMoney, formatDate}