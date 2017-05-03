export default function jsonToURL(obj) {
    return Object.keys(obj).map((i) => i + '=' + encodeURIComponent(obj[i])).join('&');
}