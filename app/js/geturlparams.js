// usage: getURLParameter('someParam')
// returns null if not found
export default function getURLParameter(name, urlArgs = location.search) {
  return decodeURIComponent(
    (new RegExp(name + "=" + "(.+?)(&|$)").exec(urlArgs) || [null, null])[1]
  );
}
