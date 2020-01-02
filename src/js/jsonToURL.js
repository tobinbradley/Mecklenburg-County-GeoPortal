// convert key:value pairs to GET argument
export default function jsonToURL(obj) {
  return Object.keys(obj)
    .map(i => i + '=' + encodeURIComponent(obj[i]))
    .join('&')
}
