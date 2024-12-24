mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // map style
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90
    zoom: 9 // starting zoom
});
const marker = new mapboxgl.Marker({color: "red"})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset:25})
.setHTML(`<h6>${listing.title}</h6><p>Exact Location Provided after booking</p>`)
.setMaxWidth("300px")
)
.addTo(map);