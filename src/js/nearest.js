import jsonToURL from "./jsontourl"

export default async function fetchNearest(lat, lng) {
  const params = {
    geom_column: "the_geom",
    limit: 1,
    columns:
      "'ADDRESS' as label, full_address as address, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat, num_parent_parcel as pid"
  };
  const response = await fetch(
      `https://mcmap.org/api2/v1/nearest/master_address_table/${lng},${lat},4326?${jsonToURL(
        params
      )}`
    )
  const json = await response.json()
  return json[0] 
}
