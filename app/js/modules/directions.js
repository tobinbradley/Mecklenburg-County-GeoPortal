export default function directions(flnglat, tlnglat) {
    return `https://maps.google.com/maps?saddr=${flnglat[1]}+${flnglat[0]}&daddr=${tlnglat[1]}+${tlnglat[0]}`;
}
